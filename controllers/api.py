# Here go your api methods.

def get_games():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    rows = db().select(db.game.ALL)
    logged_in = auth.user is not None
    games = []
    has_more = False
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            m = dict(
                id = r.id,
                userEmail = r.user_email,
                title = r.title,
                activity = r.activity,
                gameLevel = r.game_level,
                startTime = r.start_time,
                endTime = r.end_time,
                gameDate = r.game_date,
                gameLocation = r.game_location,
                description = r.description,
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
        game_level = request.vars.gameLevel,
        start_time = request.vars.startTime,
        end_time = request.vars.endTime,
        game_date = request.vars.gameDate,
        game_location = request.vars.gameLocation,
        description = request.vars.description,
        user_email = auth.user.email
    )
    return response.json(dict(game=dict(
        id = game_id,
        title = request.vars.title,
        activity = request.vars.activity,
        gameLevel = request.vars.gameLevel,
        startTime = request.vars.startTime,
        endTime = request.vars.endTime,
        gameDate = request.vars.gameDate,
        gameLocation = request.vars.gameLocation,
        description = request.vars.description,
        userEmail = auth.user.email
    )))

@auth.requires_signature()
def delete_game():
    db((db.game.id == request.vars.id) & (db.game.user_email == auth.user.email)).delete()

def get_user():
    email = None
    if auth.user is not None:
        email = auth.user.email
    return response.json(dict(
        email=email
    ))
