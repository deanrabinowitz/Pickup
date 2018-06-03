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


db.define_table('game',
                Field('user_email', default=get_user_email()),
                Field('title'),
                Field('activity', 'text'),
                Field('time', 'text'),
                Field('location', 'text'),
                Field('updated_on', 'datetime', update=datetime.datetime.utcnow()),
                Field('is_public', 'boolean', default=False)
                )

db.game.user_email.writable = False
db.game.user_email.readable = False
db.game.is_public.writable = False
db.game.is_public.readable = False
db.game.updated_on.writable = db.game.updated_on.readable = False
db.game.id.writable = db.game.id.readable = False


# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
