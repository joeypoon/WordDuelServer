const root = {
  get: (req, res) => {
    return res.json({ message: 'hooray! welcome to our api!' });
  },
};

export default root;
