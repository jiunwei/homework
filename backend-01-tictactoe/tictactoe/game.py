# Zopim Take Home Exercise
# Jiun Wei Chia
# 2017-03-22

import sys


DEFAULT_MARKERS = ('X', 'O')


class TicTacToe:
    """
    Represents state, logic and rendering for a Tic-Tac-Toe game.

    :param n:          immutable length for one side of Tic-Tac-Toe board
    :param markers:    2-tuple of one-character strs that serve as markers for each player; used for rendering

    """

    def __init__(self, n=3, markers=DEFAULT_MARKERS):
        assert n > 0
        self.n = n
        self.digits = len(str(self.n * self.n))
        self.markers = markers
        self.board = [[None] * n for _ in range(n)]

    def render_row(self, row):
        """ Returns a str representation of the specified row of the board. """
        assert row < self.n
        start = row * self.n + 1
        format_str = ' {:<' + str(self.digits) + '} '
        row = self.board[row]
        row = [
            format_str.format(start + i if row[i] is None else self.markers[int(row[i])])
            for i in range(self.n)
        ]
        return '|'.join(row) + '\n'

    def render_board(self):
        """ Returns a str representation of the current board state. """
        rows = [self.render_row(row) for row in range(self.n)]
        divider = '-' * ((self.digits + 3) * self.n - 1) + '\n'
        return divider.join(rows)

    def make_move(self, player, index):
        """ Places given player's marker on given box of the board. """
        assert player < len(self.markers)
        assert self.is_valid_move(index)
        index -= 1
        self.board[index // self.n][index % self.n] = player

    def is_valid_move(self, index):
        """ Returns whether placing a marker on given box is a valid move. """
        if index < 1 or index > self.n * self.n:
            return False
        index -= 1
        return self.board[index // self.n][index % self.n] is None

    def is_stalemate(self):
        """ Returns whether no valid moves are possible. """
        def check(value):
            return value is None
        return not any(any(box is None for box in row) for row in self.board)

    def get_winner(self):
        """ Returns winner for current board state or None if there is no winner (yet). """
        # Assume only one winner
        for player in range(len(self.markers)):
            def check(value):
                return value == player
            # Check diagonals
            diagonal1 = [self.board[i][i] for i in range(self.n)]
            diagonal2 = [self.board[i][self.n - i - 1] for i in range(self.n)]
            if all(map(check, diagonal1)) or all(map(check, diagonal2)):
                return player
            for i in range(self.n):
                # Check rows and columns
                column = [self.board[row][i] for row in range(self.n)]
                if all(map(check, self.board[i])) or all(map(check, column)):
                    return player
        # Only reaches here if no matching lines were found, so no winner
        return None


class Game:
    """
    Represents an interactive tic-tac-toe game.

    :param n:               immutable length for one side of Tic-Tac-Toe board
    :param markers:         2-tuple of one-character strs that serve as markers for each player
    :param input_stream:    BufferedIOBase object to receive input from; defaults to `sys.stdin`
    :param output_stream:   BufferedIOBase object for sending output; defaults to `sys.stdout`
    """

    PROMPT = '>> '

    def __init__(self, n=3, markers=DEFAULT_MARKERS, input_stream=sys.stdin, output_stream=sys.stdout):
        self.ttt = TicTacToe(n, markers)
        self.markers = markers
        self.input = input_stream
        self.output = output_stream

        self.names = ['Player {}'.format(player + 1) for player in range(len(self.markers))]
        self.current_player = 0

        for player in range(len(self.markers)):
            self.output.write('Enter name for {}:\n'.format(self.names[player]))
            self.output.write(Game.PROMPT)
            self.output.flush()
            self.names[player] = self.input.readline().strip()
            self.output.write('\n')

    def run(self):
        """ Runs game loop. """
        self.current_player = 0
        winner = None
        while winner is None and not self.ttt.is_stalemate():
            self.output.write(self.ttt.render_board())
            self.output.write('\n')
            message = '{}, choose a box to place an \'{}\' into:\n'.format(
                self.names[self.current_player],
                self.markers[self.current_player]
            )
            while True:
                self.output.write(message)
                self.output.write(Game.PROMPT)
                self.output.flush()
                move = self.input.readline().strip()
                self.output.write('\n')
                if move.isdigit() and self.ttt.is_valid_move(int(move)):
                    break
                self.output.write('That is not a valid box.\n')
            self.output.write('\n')
            self.ttt.make_move(self.current_player, int(move))
            self.current_player = (self.current_player + 1) % len(self.markers)
            winner = self.ttt.get_winner()
        self.output.write(self.ttt.render_board())
        self.output.write('\n')
        if winner is None:
            self.output.write('It is a draw!\n')
        else:
            self.output.write('Congratulations {}! You have won.\n'.format(self.names[winner]))


def main(argv):
    """ Main entry point. """
    n = 3
    if len(argv) > 0 and argv[0].isdigit():
        n = int(argv[0])
    Game(n=n).run()
