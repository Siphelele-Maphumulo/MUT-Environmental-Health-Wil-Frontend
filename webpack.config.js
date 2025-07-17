module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-discard-comments')(),
                  require('postcss-selector-parser')(transform),
                ],
              },
            },
          },
        ],
      },
    ],
  },
};

function transform(selectors) {
  selectors.walk(selector => {
    if (selector.type === 'combinator') {
      selector.replaceWith(selector.spaces.before + ' ' + selector.spaces.after);
    }
  });
}