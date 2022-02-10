# import _scproxy
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
                raise ValueError('Unable to add the User!')


def sign_in(username):
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                salt = pymssql.output(str)
                password = pymssql.output(str)
                uid = pymssql.output(int)
                result = cursor.callproc('UserLogin', [username, password, salt, uid])
                conn.commit()
                return {'uid': result[3], 'hash': result[1], 'salt': result[2]}
            except pymssql.DatabaseError as e:
                print(e)
                raise ValueError('Login Failed!')


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


def get_all_games(page, max_num):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getAllGames', (page, max_num))
                result = []
                for row in cursor:
                    result.append(row)
                conn.commit()
                return result
            except pymssql.DatabaseError as e:
                print(e)
                raise ValueError('Failed in getting the game info!')


def get_all_review():  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getAllReview', ())
                result = []
                for row in cursor:
                    result.append(row)
                conn.commit()
                return result
            except pymssql.DatabaseError as e:
                print(e)
                raise ValueError('Failed in getting the game info!')


def get_user_review(uid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getUserReview', (uid,))
                result = []
                for row in cursor:
                    result.append(row)
                conn.commit()
                return result
            except pymssql.DatabaseError as e:
                print(e)
                raise ValueError('Failed in getting the game info!')


def delete_game(gid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('deleteGame', gid)
                conn.commit()
                return 0
            except pymssql.DatabaseError as e:
                print("Error delete_Game")
                raise ValueError('Failed to delete the game!')


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


def add_review(uID, gID, title, content, rating):  # 还需要处理返回值
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


def update_review(rID, title, content, rating):
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('updateReview', (rID, title, content, rating))
                conn.commit()
                return 0
            except pymssql.DatabaseError:
                print("Error update_Review")
                return 1


def delete_review(rID):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('deleteReview', (rID,))
                conn.commit()
                return 0
            except pymssql.DatabaseError:
                print("Error delete_review")
                return 1


def getUsersGames(uid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getUserGames', (uid,))
                result = []
                for row in cursor:
                    result.append(row)
                conn.commit()
                return result
            except pymssql.DatabaseError as e:
                print(e)
                return 1
