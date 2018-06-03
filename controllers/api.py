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
                userEmail = r.user_email,
                title = r.title,
                activity = r.activity,
                gameTime = r.game_time,
                gameLocation = r.game_location,
                description = r.description,
                isPublic = r.is_public
            )
            games.append(m)
        else:
            has_more = True
    return response.json(dict(
        games=games,
        loggedIn=logged_in,
        hasMore=has_more
    ))

@auth.requires_signature()
def add_game():
    game_id = db.game.insert(
        title = request.vars.title,
        activity = request.vars.activity,
        game_time = request.vars.gameTime,
        game_location = request.vars.gameLocation,
        description = request.vars.description,
        is_public = False,
        user_email = auth.user.email
    )
    return response.json(dict(game=dict(
        id = game_id,
        title = request.vars.title,
        activity = request.vars.activity,
        gameTime = request.vars.gameTime,
        gameLocation = request.vars.gameLocation,
        description = request.vars.description,
        isPublic = False,
        userEmail = auth.user.email
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
        activity = row.activity,
        game_time = row.game_time,
        game_location = row.game_location,
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
