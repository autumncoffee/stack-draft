from selenium import webdriver
import os
from shlex import quote as shell_quote
from shutil import rmtree
import json
from time import sleep


WD_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'webdriver')
WD_BIN = os.path.join(WD_ROOT, 'chromedriver')
CHROME_BIN = os.path.join(WD_ROOT, 'chrome')
USER_DATA_DIR = os.path.join(WD_ROOT, 'userdata')


def main():
    assert os.path.exists(WD_BIN), f'{WD_BIN} must exist'
    assert os.path.exists(CHROME_BIN), f'{CHROME_BIN} must exist'

    if os.path.exists(USER_DATA_DIR):
        rmtree(USER_DATA_DIR)

    chrome_bin_realpath = os.readlink(CHROME_BIN)
    chrome_dir = os.path.dirname(chrome_bin_realpath)
    chrome_file = os.path.basename(chrome_bin_realpath)

    os.chdir(os.path.join(WD_ROOT, chrome_dir))

    options = webdriver.ChromeOptions()
    options.binary_location = os.path.join(os.curdir, chrome_file)

    options.add_argument('--user-data-dir={}'.format(shell_quote(USER_DATA_DIR)))
    options.add_argument('--headless')
    options.add_argument('--disable-extensions')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--no-sandbox')
    options.add_argument('start-maximized')
    options.add_argument('disable-infobars')
    options.add_argument('window-size=1280,800')
    options.add_experimental_option('useAutomationExtension', False)

    driver = webdriver.Chrome(executable_path=WD_BIN, options=options)
    driver.get('http://127.0.0.1:1490/')

    rows = driver.find_elements_by_xpath('//div[@id="__next"]/div[1]/div[2]/div')

    assert len(rows) == 4, 'Must be 4 data rows'

    for row in rows:
        cols = row.find_elements_by_xpath('.//div')

        assert len(cols) == 3, 'Each row must have 3 columns'

        id_ = int(cols[0].text.lstrip('#'))
        content = cols[1].text

        btn = cols[2].find_element_by_tag_name('button')
        btn.click()

        sleep(1)

        result = driver.find_element_by_xpath('//div[@id="__next"]/div[1]/div[2]')
        prefix = 'AJAX back response: '

        assert result.text.startswith(prefix), 'Result text must start with expected prefix'

        data = json.loads(result.text[len(prefix):])

        assert data['id'] == id_, 'ID must be expected'
        assert data['msg'] == content, 'Content must be expected'

    driver.close()
    driver.quit()
