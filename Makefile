MAKEFILE_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

RUN_DIR := $(MAKEFILE_DIR)/run
ROUTERD_DIR := $(MAKEFILE_DIR)/routerd
TOOLS_DIR := $(MAKEFILE_DIR)/tools
FRONT_DIR := $(MAKEFILE_DIR)/front
DATA_DIR := $(MAKEFILE_DIR)/data

ROUTERD_PID := $(RUN_DIR)/routerd
FRONT_PID := $(RUN_DIR)/front


default:
	@echo 'Hey!'

build_routerd:
	cd $(ROUTERD_DIR) && nix-build

build_tools:
	python3 -m pip install virtualenv ||:
	cd $(TOOLS_DIR) && python3 -m virtualenv venv
	cd $(TOOLS_DIR) && bash -c 'source ./venv/bin/activate && pip install -r ./requirements.txt'

build_front:
	cd $(FRONT_DIR) && npm install
	cd $(FRONT_DIR) && npm run build-runner
	cd $(FRONT_DIR) && npm run build

build: build_routerd build_tools build_front

create_run_dir:
	mkdir -p $(RUN_DIR)

create_data_dir:
	mkdir -p $(DATA_DIR)

start_routerd: create_run_dir
	nohup bash -c 'echo $$$$ > $(ROUTERD_PID) && exec $(ROUTERD_DIR)/result/bin/routerd $(MAKEFILE_DIR)/config/routerd.json' &

generate_data: create_data_dir
	cd $(TOOLS_DIR) && bash -c 'source ./venv/bin/activate && ROOT=$(MAKEFILE_DIR) exec ./generate_data.py'

start_front: generate_data create_run_dir
	cd $(FRONT_DIR) && nohup bash -c 'echo $$$$ > $(FRONT_PID) && ROOT=$(MAKEFILE_DIR) PORT=3000 NUM_WORKERS=4 exec npm run start' &

start: start_routerd start_front
	@sleep 1
	@echo ''
	@echo ''
	@echo '*******************************'
	@echo 'Now go to http://127.0.0.1:1490'
	@echo '*******************************'
	@echo ''
	@echo ''

stop_routerd:
	kill `cat $(ROUTERD_PID)` ||:

stop_front:
	kill `cat $(FRONT_PID)` ||:

stop: stop_routerd stop_front
