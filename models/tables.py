# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

import datetime

def get_user_email():
    return auth.user.email if auth.user is not None else None

def get_user_id():
    return auth.user.id if auth.user is not None else None

def get_user_name():
    return (auth.user.first_name + ' ' + auth.user.last_name[0] + '.') if auth.user is not None else None


db.define_table('game',
                Field('user_email', default=get_user_email()),
                Field('title', 'text'),
                Field('description', 'text', default="No description"),
                Field('activity', 'text'),
                Field('game_level', 'text'),
                Field('start_time', 'text'),
                Field('end_time', 'text'),
                Field('game_date', 'text'),
                Field('game_location', 'text'),
                Field('updated_on', 'datetime', update=datetime.datetime.utcnow()),
                Field('players', 'list:reference auth_user', default=[get_user_id()])
                )

db.define_table('game_comment',
                Field('author_id','reference auth_user', default=get_user_id()),
                Field('author_name', 'text', default=get_user_name()),
                Field('game','reference game'),
                Field('comment_content', 'text'),
                Field('posted_on', 'datetime', default=datetime.datetime.utcnow())
                )

db.game.user_email.writable = False
db.game.user_email.readable = False
db.game.updated_on.writable = db.game.updated_on.readable = False
db.game.id.writable = db.game.id.readable = False


# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
