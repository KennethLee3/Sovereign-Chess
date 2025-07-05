# README

This is an in-progress implementation of the game Sovereign Chess. The most recent deployment can be seen at https://sovereign-chess.onrender.com. 

## Board Notation

This is the current way of notating a Sovereign Chess board for import and export, and it is based on the popular FEN notation. 
Each rank is described starting from 16 down to 1, separated by a forward slash (/). The pieces in the rank are listed from file A to P. Each piece is notated by listing its color identifier followed by its piece identifier, which are enumerated below. When a square or squares are empty, they are indicated using a period (.) followed by the hexidecimal number corresponding to the number of empty squares in a row. 

| Piece | Symbol |
| ----- | ------ |
| King | K |
| Queen | Q |
| Rook | R |
| Bishop | B |
| Knight | N |
| Pawn | P |

| Color | Symbol |
| ----- | ------ |
| White | w |
| Black | b |
| Silver | s |
| Gold | g |
| Orange | o |
| Royal Blue | a |
| Purple | p |
| Brown | n |
| Yellow | y |
| Green | e |
| Red | r |
| Blue | l |
