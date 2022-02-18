# import _scproxy
import pymssql
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


def get_user_profile(uid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getUserProfile', (uid,))
                result = []
                for row in cursor:
                    result.append(row)
                conn.commit()
                return result
            except pymssql.DatabaseError as e:
                print(e)
                raise ValueError('Failed in getting the user info!')


def update_user_profile(uid, address, email, phone, role):
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('updateUserProfile', (uid, address, email, phone, role))
                conn.commit()
                return 0
            except pymssql.DatabaseError:
                print("Error in update_user")
                return 1


def add_game(name, description, version, download, price, release_date):
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                gid = pymssql.output(int)
                result = cursor.callproc('addGame', (name, description, version, download, price, release_date, gid))
                conn.commit()
                return result[6]
            except pymssql.DatabaseError as e:
                print(e)
                raise ValueError('Failed in adding the game!')


def get_all_games_with_category():  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getAllGameWithCategory', ())
                result = []
                for row in cursor:
                    result.append(row)
                conn.commit()
                return result
            except pymssql.DatabaseError as e:
                print(e)
                raise ValueError('Failed in getting the game info!')


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


def get_all_games_by_name(name):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getAllGamesByName', (name,))
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
                print(gid)
                cursor.callproc('deleteGame', (gid,))
                conn.commit()
                return 0
            except pymssql.DatabaseError as e:
                print(e)
                raise ValueError('Failed to delete the game!')


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


def get_specific_game_by_user(gid, uid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getSpecificGameByUser', (gid, uid))
                result = []
                for row in cursor:
                    result.append(row)
                conn.commit()
                return result
            except pymssql.DatabaseError as e:
                print(e)
                raise ValueError('Failed in getting the game info!')


def get_game_review(gid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getReviewByGame', (gid,))
                result = []
                for row in cursor:
                    result.append(row)
                conn.commit()
                return result
            except pymssql.DatabaseError as e:
                print(e)
                raise ValueError('Failed in getting the game info!')


def delete_user_game(uid, gid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('deleteUserGame', (uid, gid))
                conn.commit()
                return 0
            except pymssql.DatabaseError as e:
                print(e)
                raise ValueError('Failed to delete the game!')


def add_user_own_games(uid, gid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('addUserOwnGame', (uid, gid))
                conn.commit()
                return 0
            except pymssql.DatabaseError as e:
                print(e)
                raise ValueError("failed to get user's game")


def add_review(uid, gid, title, content, rating):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                rid = pymssql.output(int)
                result = cursor.callproc('addReview', (uid, gid, title, content, rating, rid))
                conn.commit()
                return result[5]
            except pymssql.DatabaseError:
                print("Error in add_Review")
                return 1


def update_review(rid, title, content, rating):
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('updateReview', (rid, title, content, rating))
                conn.commit()
                return 0
            except pymssql.DatabaseError:
                print("Error update_Review")
                return 1


def delete_review(uid, rid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('deleteReview', (rid, uid))
                conn.commit()
                return 0
            except pymssql.DatabaseError:
                print("Error delete_review")
                return 1


def get_users_games(uid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                gids = pymssql.output(str)
                result = cursor.callproc('getUserGames', (uid, gids))
                return result[1]
            except pymssql.DatabaseError as e:
                print(e)
                return -1


def get_games_by_category(cid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getGameByCategory', (cid,))
                result = []
                for row in cursor:
                    result.append(row)
                conn.commit()
                return result
            except pymssql.DatabaseError as e:
                print(e)
                return 1


def get_billing_info(uid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getBillingInfoByUser', (uid,))
                result = []
                for row in cursor:
                    result.append(row)
                conn.commit()
                return result
            except pymssql.DatabaseError as e:
                print(e)
                return 1


def delete_billing_info(bid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('deleteBillingInfo', (bid,))
                conn.commit()
                return 0
            except pymssql.DatabaseError:
                print("Error deleteBillingInfo")
                return 1


def add_billing_info(cc_number, name_on_card, uid, expdate, security_code):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                bid = pymssql.output(int)
                result = cursor.callproc('addBillingInfo', (cc_number, name_on_card, uid, expdate, security_code, bid))
                conn.commit()
                return result[5]
            except pymssql.DatabaseError:
                print("Error in addBillingInfo")
                return 1


def get_specific_review(uid, gid):  # 还需要处理返回值
    with db_connect() as conn:
        with conn.cursor(as_dict=True) as cursor:
            try:
                cursor.callproc('getSpecificReview', (uid, gid))
                result = []
                for row in cursor:
                    result.append(row)
                conn.commit()
                return result
            except pymssql.DatabaseError as e:
                print(e)
                return 1
