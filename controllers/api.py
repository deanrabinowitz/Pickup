# Here go your api methods.

def get_memos():
    print('get memos')
    print(request.vars)
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    if auth.user is not None:
        rows = db((db.memo.user_email == auth.user.email) | (db.memo.is_public == True)).select()
        logged_in = True
    else:
        rows = db(db.memo.is_public == True).select()
        logged_in = False
    memos = []
    has_more = False
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            m = dict(
                id = r.id,
                user_email = r.user_email,
                title = r.title,
                body = r.body,
                is_public = r.is_public
            )
            memos.append(m)
        else:
            has_more = True
    print(memos)
    return response.json(dict(
        memos=memos,
        logged_in=logged_in,
        has_more=has_more
    ))

@auth.requires_signature()
def add_memo():
    memo_id = db.memo.insert(
        title = request.vars.title,
        body = request.vars.body,
        is_public = False,
        user_email = auth.user.email
    )
    return response.json(dict(memo=dict(
        id = memo_id,
        title = request.vars.title,
        body = request.vars.body,
        is_public = False,
        user_email = auth.user.email
    )))

@auth.requires_signature()
def delete_memo():
    db((db.memo.id == request.vars.id) & (db.memo.user_email == auth.user.email)).delete()

@auth.requires_signature()
def toggle_public():
    row = db((db.memo.id == request.vars.id) & (db.memo.user_email == auth.user.email)).select().first()
    print(row)
    original = row.is_public
    row.update_record(is_public=(not original))
    return response.json(dict(memo=dict(
        id = row.id,
        title = row.title,
        body = row.body,
        is_public = row.is_public,
        user_email = row.user_email
    )))

def get_user():
    email = None
    if auth.user is not None:
        email = auth.user.email
    return response.json(dict(
        email=email
    ))
