#!/usr/bin/env python3

from t_requests.main import main as requests_main
from t_selenium.main import main as selenium_main


def main():
    requests_main()
    # selenium_main()

    print('OK')


if __name__ == '__main__':
    main()
