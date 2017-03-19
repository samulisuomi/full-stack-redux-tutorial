import Server from 'socket.io';

export const startServer = store => {
  const io = new Server().attach(8090);

  // TODO: improve performance by only sending out what was changed:
  store.subscribe(
    () => io.emit('state', store.getState().toJS())
  );

  io.on('connection', socket => {
    socket.emit('state', store.getState().toJS())
    socket.on('action', store.dispatch.bind(store))
  });
};