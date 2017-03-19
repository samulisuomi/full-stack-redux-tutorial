import { List, Map } from 'immutable';

export const setEntries = (state, entries) => {
  return state.set('entries', List(entries));
};

const getWinners = vote => {
  if (!vote) {
    return [];
  } else {
    const [a, b] = vote.get('pair');
    const aVotes = vote.getIn(['tally', a], 0);
    const bVotes = vote.getIn(['tally', b], 0);
    // Return things as a List:
    if (aVotes > bVotes) {
      return [a];
    } else if (aVotes < bVotes) {
      return [b];
    } else {
      return [a, b];
    }
  }
}

export const next = state => {
  // New entries consist of previous entries + the winner(s):
  const entries = state
    .get('entries')
    .concat(getWinners(state.get('vote')));
  if (entries.size === 1) {
    return state
      .remove('vote')
      .remove('entries')
      .set('winner', entries.first());
  } else {
    return state.merge({
      // the rest of the entries:
      entries: entries.skip(2),
      vote: Map({
        // the first two entries:
        pair: entries.take(2)
      })
    });
  }
};

export const vote = (state, entry) => {
  return state.updateIn(
    // keyPath:
    ['vote', 'tally', entry],
    // default value if the key doesn't yet exist:
    0,
    tally => tally + 1
  );
}