# Here go your api methods.

def get_games():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    if auth.user is not None:
        rows = db((db.game.user_email == auth.user.email) | (db.game.is_public == True)).select()
        logged_in = True
    else:
        rows = db(db.game.is_public == True).select()
        logged_in = False
    games = []
    has_more = False
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            m = dict(
                id = r.id,
                user_email = r.user_email,
                title = r.title,
                description = r.description,
                is_public = r.is_public
            )
            games.append(m)
        else:
            has_more = True
    return response.json(dict(
        games=games,
        logged_in=logged_in,
        has_more=has_more
    ))

@auth.requires_signature()
def add_game():
    game_id = db.game.insert(
        title = request.vars.title,
        description = request.vars.description,
        is_public = False,
        user_email = auth.user.email
    )
    return response.json(dict(game=dict(
        id = game_id,
        title = request.vars.title,
        description = request.vars.description,
        is_public = False,
        user_email = auth.user.email
    )))

@auth.requires_signature()
def delete_game():
    db((db.game.id == request.vars.id) & (db.game.user_email == auth.user.email)).delete()

@auth.requires_signature()
def toggle_public():
    row = db((db.game.id == request.vars.id) & (db.game.user_email == auth.user.email)).select().first()
    print(row)
    original = row.is_public
    row.update_record(is_public=(not original))
    return response.json(dict(game=dict(
        id = row.id,
        title = row.title,
        description = row.description,
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
