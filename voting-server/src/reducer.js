import { INITIAL_STATE, setEntries, next, vote } from '../src/core';

export default function reducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case 'SET_ENTRIES':
      return setEntries(state, action.entries);
    case 'NEXT':
      return next(state);
    case 'VOTE':
      // return vote(state, action.entry); // not anymore; we only want to modify the vote part:
      return state.update('vote', voteState => vote(voteState, action.entry));
    default:
      return state;
  }
}