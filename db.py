import pymssql
import config


class DBConnection:

    def __init__(self):
        # connect takes url, dbname, user-id, password
        self.server = config.server
        self.username = config.username
        self.password = config.password
        self.database = config.database
        self.conn = self.connect()
        self.cursor = self.conn.cursor()

    def connect(self):
        try:
            return pymssql.connect(server=self.server, user=self.username,
                                        password=self.password, database=self.database)
        except:
            return 'Fail'

    def __del__(self):
        self.cursor.close()
        self.conn.close()
