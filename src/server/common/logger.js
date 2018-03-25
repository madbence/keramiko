const levels = [
  'debug',
  'info',
  'warning',
  'error',
];

let logger;

function createRecord(context, message) {
  if (typeof context == 'string') {
    return {message: context};
  } else if (context instanceof Error) {
    return {error: context};
  }
  context.message = message;
  return context;
}

function create(opts) {
  const logger = {};
  const handle = opts.handler;
  const context = opts.context || {};

  for (const level of levels) {
    logger[level] = (logContext, message) => {
      const record = createRecord(logContext, message);

      handle({
        level,
        ...context,
        ...record,
      });
    };
  }

  logger.child = name => create({
    ...opts,
    context: {
      ...context,
      name,
    },
  });

  return logger;
}

export function getLogger(name) {
  return logger.child(name);
}

export function configure(opts) {
  logger = create(opts);
}
