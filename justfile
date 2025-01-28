test-all:
    node --import tsx --test **/*.test.ts

test FILE:
    node --import tsx --test {{ FILE }}

test-day YEAR DAY:
    node --import tsx --test src/solvers/{{ YEAR }}/`printf "%02d" "{{ DAY }}"`.test.ts

run YEAR DAY:
    ./aoc --year {{ YEAR }} --day {{ DAY }} --input inputs/{{ YEAR }}-`printf "%02d" "{{ DAY }}"`.txt