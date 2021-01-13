#!/usr/bin/env python3

from lxml import etree
import requests as http
from io import BytesIO
import re
import os


def test():
    expected_rows = {
        1: 'hello',
        2: 'hi',
        3: 'hey',
        4: 'hola',
    }

    for id_, msg in expected_rows.items():
        response = http.get('http://127.0.0.1:1490/api/info/{}'.format(id_))
        assert response.status_code == 200, 'Request must be successfull'

        data = response.json()

        assert data['id'] == id_, 'ID must be expected'
        assert data['msg'] == msg, 'Content must be expected'

    response = http.get('http://127.0.0.1:1490/')
    assert response.status_code == 200, 'Request must be successfull'

    tree = etree.parse(BytesIO(response.content), etree.HTMLParser())

    backMessage = tree.xpath('//div[@id="__next"]/div[1]/div[1]')[0].text

    assert backMessage == 'Backstage back response: {"msg":"Hello from back!"}', 'Got backstage back response'

    for row in tree.xpath('//div[@id="__next"]/div[1]/div[2]/div'):
        children = list(row)

        assert len(children) == 3, 'Each data row must have 3 columns'

        idMatch = re.search(r'^#([0-9])$', children[0].text)

        assert idMatch is not None, 'First column is ID in form #num'

        id_ = int(idMatch.groups()[0])

        assert id_ in expected_rows, 'ID must be expected'

        assert expected_rows.pop(id_) == children[1].text, 'Content must be expected'

    assert len(expected_rows) == 0, 'No rows are lost, not extra rows'


def main():
    workers = []

    for _ in range(10):
        pid = os.fork()

        if pid == 0:
            for _ in range(100):
                test()

            return

        else:
            workers.append(pid)

    ok = True

    for pid in workers:
        if os.waitpid(pid, 0)[1] != 0:
            ok = False

    assert ok, 'All workers must succeed'

    print('OK')


if __name__ == '__main__':
    main()
