import { combineReducers } from 'redux';
import repositories from './repositories';
import repositoriesLanguages from './repositories/languages';
import section from './section';

export default combineReducers({
  repositories,
  repositoriesLanguages,
  section,
});
