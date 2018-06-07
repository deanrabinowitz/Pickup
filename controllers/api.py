# Here go your api methods.

def get_games():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    rows = db(db.game.activity.contains(request.vars['activityFilter[]'], all=False) & db.game.game_level.contains(request.vars['levelFilter[]'], all=False)).select(db.game.ALL)
    logged_in = auth.user is not None
    games = []
    has_more = False
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            comments = db(db.game_comment.game == r.id).select()
            # Get the comments for the game
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
                players = r.players,
                comments = comments
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
        userEmail = auth.user.email,
        players = [auth.user.id],
        comments = []
    )))

@auth.requires_signature()
def delete_game():
    db((db.game.id == request.vars.id) & (db.game.user_email == auth.user.email)).delete()

@auth.requires_signature()
def join_game():
    row = db(db.game.id == request.vars.id).select().first()
    print row.players
    if auth.user.id not in row.players:
        row.players.append(auth.user.id)
        row.update_record()
    return "ok"

@auth.requires_signature()
def leave_game():
    row = db(db.game.id == request.vars.id).select().first()
    if auth.user.id in row.players:
        row.players.remove(auth.user.id)
        row.update_record()
    return "ok"

@auth.requires_signature()
def add_comment():
    db.game_comment.insert(
        comment_content = request.vars.commentContent,
        game = request.vars.gameID
    )
    return "ok"

def get_user():
    if auth.user is None:
        return None
    return response.json(dict(
        email=auth.user.email,
        id=auth.user.id,
        firstName=auth.user.first_name,
        lastName=auth.user.last_name
    ))
