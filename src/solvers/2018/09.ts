import { createSolverWithString } from "../../solution";

// Doubly linked list node
type Node = {
  value: number;
  prev?: Node;
  next?: Node;
};

function play(players: number, lastMarble: number): number {
  const scores = Array(players).fill(0);
  const firstNode: Node = { value: 0 };
  firstNode.prev = firstNode;
  firstNode.next = firstNode;

  let currentNode = firstNode;
  let currentPlayer = 0;
  let currentMarble = 1;

  while (currentMarble <= lastMarble) {
    if (currentMarble % 23 === 0) {
      scores[currentPlayer] += currentMarble;
      for (let j = 0; j < 7; j++) {
        currentNode = currentNode.prev!;
      }

      scores[currentPlayer] += currentNode.value;
      currentNode.prev!.next = currentNode.next;
      currentNode.next!.prev = currentNode.prev;
      currentNode = currentNode.next!;
    } else {
      const newNode: Node = { value: currentMarble };
      newNode.prev = currentNode.next;
      newNode.next = currentNode.next!.next;
      currentNode.next!.next!.prev = newNode;
      currentNode.next!.next = newNode;
      currentNode = newNode;
    }

    currentPlayer = (currentPlayer + 1) % players;
    currentMarble++;
  }

  return Math.max(...scores);
}

export default createSolverWithString(async (input) => {
  const parts = input.split(" ");
  const players = Number.parseInt(parts[0]);
  const lastMarble = Number.parseInt(parts[6]);

  return {
    first: play(players, lastMarble),
    second: play(players, lastMarble * 100),
  };
});
