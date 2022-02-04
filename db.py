import _scproxy
import pymssql
from pymssql import _mssql
import config


def db_connect():
    try:
        return pymssql.connect(server=config.server, user=config.username,
                               password=config.password, database=config.database)
    except pymssql.InterfaceError:
        print("A MSSQLDriverException has been caught.")

    except pymssql.DatabaseError:
        print("A MSSQLDatabaseException has been caught.")


def add_user(name, password):
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                uid = pymssql.output(int)
                result = cursor.callproc('addUser', [name, password, None, uid])
                conn.commit()
                return result[3]
            except pymssql.DatabaseError as e:
                print(e)
                return e


# def sign_in(name, password):
#     with db_connect() as conn:
#         with conn.cursor(as_dict=True) as cursor:
#             try:
#                 uid = pymssql.output(int)
#                 result = cursor.callproc('addUser', [name, password, None, uid])
#                 conn.commit()
#                 return result[3]
#             except pymssql.DatabaseError as e:
#                 print(e)
#                 return e

def update_user(name, password):
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('updateUser', (name, password,))
                conn.commit()
                return 0
            except pymssql.DatabaseError:
                print("Error in update_user")
                return 1


def add_game(name, releasedate, price, description, download, version):
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                gid = pymssql.output(int)
                result = cursor.callproc('addGame', (version, releasedate, price, description, download, name, gid))
                conn.commit()
                return result[6]
            except pymssql.DatabaseError:
                print("Error in add_game")
                return 1


def add_UserOwnGames(uID, gID):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('addUserOwnGame', (uID, gID))
                conn.commit()
                return 0
            except pymssql.DatabaseError:
                print("Error add_UserOwnGames")
                return 1


def add_Review(uID, gID, title, content, rating):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                rid = pymssql.output(int)
                result = cursor.callproc('addReview', (uID, gID, title, content, rating, rid))
                conn.commit()
                return result[5]
            except pymssql.DatabaseError:
                print("Error in add_Review")
                return 1


def update_Review(rID, title, content, rating):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('updateReview', (rID, title, content, rating))
                conn.commit()
                return 0
            except pymssql.DatabaseError:
                print("Error update_Review")
                return 1


def delete_Game(gid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('deleteGame', gid)
                conn.commit()
                return 0
            except pymssql.DatabaseError:
                print("Error delete_Game")
                return 1


def get_AllGames(page, max):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getAllGames', (page, max))
                result = []
                for row in cursor:
                    result.append(row)
                conn.commit()

                return result
            except pymssql.DatabaseError as e:
                print(e)
                return 1


def getUsersGames(uid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getUserGames', (uid))
                result = []
                for row in cursor:
                    result.append(row)
                conn.commit()

                return result
            except pymssql.DatabaseError as e:
                print(e)
                return 1
