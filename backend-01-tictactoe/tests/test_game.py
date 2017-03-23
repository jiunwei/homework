# Zopim Take Home Exercise Unit Tests
# Jiun Wei Chia
# 2017-03-22

import unittest
from os.path import dirname, join
from io import StringIO

from tictactoe.game import TicTacToe, Game


class TicTacToeTest(unittest.TestCase):

    def test_init(self):
        ttt = TicTacToe()
        self.assertEqual(len(ttt.board), 3)
        self.assertEqual(len(ttt.board[0]), 3)
        self.assertEqual(ttt.board[0][0], None)
        self.assertEqual(ttt.board[2][2], None)

        ttt = TicTacToe(markers=('*', '#'))
        ttt.make_move(0, 2)
        ttt.make_move(1, 6)
        self.assertEqual(ttt.render_row(0), ' 1 | * | 3 \n')
        self.assertEqual(ttt.render_row(1), ' 4 | 5 | # \n')

    def test_render_row(self):
        ttt = TicTacToe()
        self.assertEqual(ttt.render_row(0), ' 1 | 2 | 3 \n')
        self.assertEqual(ttt.render_row(1), ' 4 | 5 | 6 \n')
        self.assertEqual(ttt.render_row(2), ' 7 | 8 | 9 \n')

        ttt = TicTacToe(n=5)
        self.assertEqual(ttt.render_row(0), ' 1  | 2  | 3  | 4  | 5  \n')
        self.assertEqual(ttt.render_row(1), ' 6  | 7  | 8  | 9  | 10 \n')
        self.assertEqual(ttt.render_row(2), ' 11 | 12 | 13 | 14 | 15 \n')
        self.assertEqual(ttt.render_row(4), ' 21 | 22 | 23 | 24 | 25 \n')

        ttt = TicTacToe(n=10)
        self.assertEqual(ttt.render_row(0), ' 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  \n')
        self.assertEqual(ttt.render_row(5), ' 51  | 52  | 53  | 54  | 55  | 56  | 57  | 58  | 59  | 60  \n')

    def test_render_board(self):
        ttt = TicTacToe()
        self.assertEqual(ttt.render_board(),
                         ' 1 | 2 | 3 \n' +
                         '-----------\n' +
                         ' 4 | 5 | 6 \n' +
                         '-----------\n' +
                         ' 7 | 8 | 9 \n')

        ttt = TicTacToe(n=4)
        self.assertEqual(ttt.render_board(),
                         ' 1  | 2  | 3  | 4  \n' +
                         '-------------------\n' +
                         ' 5  | 6  | 7  | 8  \n' +
                         '-------------------\n' +
                         ' 9  | 10 | 11 | 12 \n' +
                         '-------------------\n' +
                         ' 13 | 14 | 15 | 16 \n')

    def test_make_move(self):
        ttt = TicTacToe()
        ttt.make_move(0, 2)
        ttt.make_move(1, 6)
        self.assertEqual(ttt.render_row(0), ' 1 | X | 3 \n')
        self.assertEqual(ttt.render_row(1), ' 4 | 5 | O \n')

    def test_is_valid_move(self):
        ttt = TicTacToe()
        self.assertTrue(ttt.is_valid_move(1))
        self.assertTrue(ttt.is_valid_move(2))
        self.assertTrue(ttt.is_valid_move(3))
        self.assertTrue(ttt.is_valid_move(4))
        self.assertTrue(ttt.is_valid_move(9))

        ttt = TicTacToe()
        ttt.make_move(0, 2)
        ttt.make_move(1, 6)
        ttt.make_move(0, 8)
        ttt.make_move(1, 5)
        ttt.make_move(0, 4)
        self.assertTrue(ttt.is_valid_move(1))
        self.assertFalse(ttt.is_valid_move(2))
        self.assertTrue(ttt.is_valid_move(3))
        self.assertFalse(ttt.is_valid_move(4))
        self.assertTrue(ttt.is_valid_move(9))
        ttt.make_move(1, 7)
        ttt.make_move(0, 3)
        ttt.make_move(1, 1)
        ttt.make_move(0, 9)
        self.assertFalse(ttt.is_valid_move(1))
        self.assertFalse(ttt.is_valid_move(2))
        self.assertFalse(ttt.is_valid_move(3))
        self.assertFalse(ttt.is_valid_move(4))
        self.assertFalse(ttt.is_valid_move(9))

        ttt = TicTacToe(n=1)
        self.assertTrue(ttt.is_valid_move(1))
        ttt.make_move(0, 1)
        self.assertFalse(ttt.is_valid_move(1))

    def test_is_stalemate(self):
        ttt = TicTacToe()
        ttt.make_move(0, 2)
        ttt.make_move(1, 6)
        ttt.make_move(0, 8)
        ttt.make_move(1, 5)
        ttt.make_move(0, 4)
        self.assertFalse(ttt.is_stalemate())
        ttt.make_move(1, 7)
        ttt.make_move(0, 3)
        ttt.make_move(1, 1)
        ttt.make_move(0, 9)
        self.assertTrue(ttt.is_stalemate())

        # is_stalemate() should return True as long as no valid moves are possible, even if there is a winner
        ttt = TicTacToe()
        ttt.make_move(0, 1)
        ttt.make_move(1, 6)
        ttt.make_move(0, 2)
        ttt.make_move(1, 7)
        ttt.make_move(0, 3)
        ttt.make_move(1, 8)
        ttt.make_move(0, 4)
        ttt.make_move(1, 9)
        ttt.make_move(0, 5)
        self.assertTrue(ttt.is_stalemate())

    def test_get_winner(self):
        # Test no winner
        ttt = TicTacToe()
        ttt.make_move(0, 2)
        ttt.make_move(1, 6)
        ttt.make_move(0, 8)
        ttt.make_move(1, 5)
        ttt.make_move(0, 4)
        ttt.make_move(1, 7)
        ttt.make_move(0, 3)
        ttt.make_move(1, 1)
        ttt.make_move(0, 9)
        self.assertEqual(ttt.get_winner(), None)

        # Test winning column
        ttt = TicTacToe()
        ttt.make_move(0, 3)
        ttt.make_move(1, 5)
        ttt.make_move(0, 6)
        ttt.make_move(1, 1)
        ttt.make_move(0, 9)
        self.assertEqual(ttt.get_winner(), 0)

        # Test winning row
        ttt = TicTacToe()
        ttt.make_move(0, 2)
        ttt.make_move(1, 6)
        ttt.make_move(0, 8)
        ttt.make_move(1, 5)
        ttt.make_move(0, 7)
        ttt.make_move(1, 4)
        self.assertEqual(ttt.get_winner(), 1)

        # Test winning diagonal
        ttt = TicTacToe()
        ttt.make_move(0, 3)
        ttt.make_move(1, 8)
        ttt.make_move(0, 5)
        ttt.make_move(1, 9)
        ttt.make_move(0, 7)
        self.assertEqual(ttt.get_winner(), 0)

        ttt = TicTacToe(n=1)
        self.assertEqual(ttt.get_winner(), None)
        ttt.make_move(0, 1)
        self.assertEqual(ttt.get_winner(), 0)


class GameTest(unittest.TestCase):

    def test_init(self):
        input_stream = StringIO('John Doe\nMichael Doe\n')
        output_stream = StringIO()
        game = Game(input_stream=input_stream, output_stream=output_stream)
        self.assertEqual(game.names, ['John Doe', 'Michael Doe'])
        self.assertEqual(output_stream.getvalue(),
                         'Enter name for Player 1:\n>> \nEnter name for Player 2:\n>> \n')

    def test_run_1(self):
        input_stream = StringIO('John Doe\nMichael Doe\n1\n2\n4\n5\n7\n')
        output_stream = StringIO()
        game = Game(markers=('x', 'o'), input_stream=input_stream, output_stream=output_stream)
        output_stream.truncate(0)
        output_stream.seek(0)
        game.run()
        with open(join(dirname(__file__), 'sample.txt')) as file:
            sample = file.read()
        self.assertEqual(output_stream.getvalue(), sample)

    def test_run_2(self):
        input_stream = StringIO('John Doe\nMichael Doe\n2\n1')
        output_stream = StringIO()
        game = Game(n=1, input_stream=input_stream, output_stream=output_stream)
        output_stream.truncate(0)
        output_stream.seek(0)
        game.run()
        self.assertEqual(output_stream.getvalue(),
                         ' 1 \n\n' +
                         'John Doe, choose a box to place an \'X\' into:\n>> \n'
                         'That is not a valid box.\n'
                         'John Doe, choose a box to place an \'X\' into:\n>> \n\n'
                         ' X \n\n' +
                         'Congratulations John Doe! You have won.\n')

    def test_run_3(self):
        input_stream = StringIO('John Doe\nMichael Doe\n2\n6\n2\n8\n5\n4\n7\n3\n1\n9\n')
        output_stream = StringIO()
        game = Game(input_stream=input_stream, output_stream=output_stream)
        output_stream.truncate(0)
        output_stream.seek(0)
        game.run()
        with open(join(dirname(__file__), 'sample2.txt')) as file:
            sample = file.read()
        self.assertEqual(output_stream.getvalue(), sample)

if __name__ == '__main__':
    unittest.main()
