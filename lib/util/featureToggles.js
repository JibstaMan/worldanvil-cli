const { MEMBERSHIPS } = require('../constants');

const MEMBERSHIP_KEYS = Object.keys(MEMBERSHIPS);

function tierOrAbove(tier, membership) {
  return MEMBERSHIP_KEYS.indexOf(membership) >= MEMBERSHIP_KEYS.indexOf(tier);
}

function skipSelectorRootsValidation(membership) {
  return tierOrAbove('sage', membership);
}

module.exports = {
  skipSelectorRootsValidation,
};
