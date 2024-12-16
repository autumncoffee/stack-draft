default:
	@echo 'Usage:'
	@echo '    make build - builds all'
	@echo '    make start - starts all'
	@echo '    make test - to run tests'
	@echo '    make stop - stops all'
	@echo ''
	@echo 'Further info - read Makefile yourself'
	@echo ''


MAKEFILE_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

RUN_DIR := $(MAKEFILE_DIR)/run
ROUTERD_DIR := $(MAKEFILE_DIR)/routerd
BACK_DIR := $(MAKEFILE_DIR)/back
TOOLS_DIR := $(MAKEFILE_DIR)/tools
TESTS_DIR := $(MAKEFILE_DIR)/tests
FRONT_DIR := $(MAKEFILE_DIR)/front
DATA_DIR := $(MAKEFILE_DIR)/data

ROUTERD_PID := $(RUN_DIR)/routerd
BACK_PID := $(RUN_DIR)/back
FRONT_PID := $(RUN_DIR)/front


install_virtualenv:
	python3 -m pip install virtualenv ||:

define setup_virtualenv
	cd $(1) && python3 -m virtualenv venv
	cd $(1) && bash -c 'source ./venv/bin/activate && exec pip install -r ./requirements.txt'
endef

build_routerd:
	cd $(ROUTERD_DIR) && nix-build

build_back:
	cd $(BACK_DIR) && nix-build

build_tools: install_virtualenv
	$(call setup_virtualenv,$(TOOLS_DIR))

build_tests: install_virtualenv
	$(call setup_virtualenv,$(TESTS_DIR))
	$(TESTS_DIR)/install.sh

build_front:
	cd $(FRONT_DIR) && npm install
	cd $(FRONT_DIR) && npm run build-runner
	cd $(FRONT_DIR) && npm run build

build: build_routerd build_back build_tools build_tests build_front

create_run_dir:
	mkdir -p $(RUN_DIR)

create_data_dir:
	mkdir -p $(DATA_DIR)

start_routerd: create_run_dir
	nohup bash -c 'echo $$$$ > $(ROUTERD_PID) && exec $(ROUTERD_DIR)/result/bin/routerd $(MAKEFILE_DIR)/config/routerd.json' &

start_back: create_run_dir
	cd $(BACK_DIR) && nohup bash -c 'echo $$$$ > $(BACK_PID) && ROOT=$(MAKEFILE_DIR) BIND_V4=127.0.0.1 BIND_PORT=1497 exec ./result/bin/back' &

generate_data: create_data_dir
	cd $(TOOLS_DIR) && bash -c 'source ./venv/bin/activate && ROOT=$(MAKEFILE_DIR) exec ./generate_data.py'

start_front: generate_data create_run_dir
	cd $(FRONT_DIR) && nohup bash -c 'echo $$$$ > $(FRONT_PID) && ROOT=$(MAKEFILE_DIR) PORT=3003 NUM_WORKERS=4 exec npm run start' &

start: start_routerd start_back start_front
	@sleep 1
	@echo ''
	@echo ''
	@echo '*******************************'
	@echo 'Now go to http://127.0.0.1:1492'
	@echo '*******************************'
	@echo ''
	@echo ''

test:
	cd $(TESTS_DIR) && bash -c 'source ./venv/bin/activate && exec ./main.py'

stop_routerd:
	kill `cat $(ROUTERD_PID)` ||:

stop_back:
	kill `cat $(BACK_PID)` ||:

stop_front:
	kill `cat $(FRONT_PID)` ||:

stop: stop_routerd stop_back stop_front

tail:
	exec tail -f nohup.out back/nohup.out front/nohup.out
