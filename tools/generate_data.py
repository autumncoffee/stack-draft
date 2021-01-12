#!/usr/bin/env python3

from ac_diskstructs import HashMap
import os


def main():
    path = os.path.join(os.getenv('ROOT'), 'data', 'example.hashmap')

    if os.path.exists(path):
        os.unlink(path)

    bucket_count = 16
    hm = HashMap(path, bucket_count=bucket_count)

    hm[1] = 'hello'
    hm[2] = 'hi'
    hm[3] = 'hey'
    hm[4] = 'hola'

    hm.close()
    hm.delete()


if __name__ == '__main__':
    main()
