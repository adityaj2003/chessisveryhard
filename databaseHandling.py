# import psycopg2
# import chess.pgn as pgn

# conn = psycopg2.connect(
#     database="postgres", 
#     user="postgres", 
#     password = os.getenv('AWS_PUZZLEDB_PASSWORD'), 
#     host="database-1.cbxymylid2b5.us-west-2.rds.amazonaws.com", 
#     port="5432"
# )

# cur = conn.cursor()

# i = 0
# with open("puzzles.pgn") as pgn_file:  # Replace "games.pgn" with your PGN file path
#     while True:
#         game = pgn.read_game(pgn_file)
#         if game is None:  # All games have been read
#             break

#         event = game.headers["Event"]
#         white = game.headers["White"]
#         black = game.headers["Black"]
#         fen = game.headers.get("FEN", "")
#         moves = game.board().variation_san(game.mainline_moves())
#         cur.execute("""INSERT INTO puzzles (puzzleId, fen, moves, event, white, black) VALUES (%s, %s, %s, %s, %s, %s)""", (i, fen, moves, event, white, black))
#         i += 1
        
# conn.commit()
# cur.close()
# conn.close()

import psycopg2
import chess.pgn as pgn



cur = conn.cursor()

cur.execute("""SELECT fen FROM puzzles WHERE puzzleId = 0""")

fenString = cur.fetchone()[0]
print("Random puzzle FEN:", fenString)

cur.close()
conn.close()