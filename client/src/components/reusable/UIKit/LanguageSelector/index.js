import React from 'react';
import { connect } from 'react-redux';
import { actions as preferencesAPI } from '../../../../redux/PreferencesSlice';
import './LanguageSelector.scss';

import ukrainianFlag from '../../../../assets/ukrainianFlag.svg';
import ukFlag from '../../../../assets/ukFlag.svg';
import russianFlag from '../../../../assets/russianFlag.svg';

const LanguageSelector = ({ setStartLanguage }) => {
  return (
      <div className='LanguageSelector'>
          <img onClick={() => setStartLanguage('ukr')} className='language-icon' src={ukrainianFlag} alt='ukrainian' />
          <img onClick={() => setStartLanguage('en')} className='language-icon' src={ukFlag} alt='english' />
          <img onClick={() => setStartLanguage('ru')} className='language-icon' src={russianFlag} alt='russian' />
      </div>
  );
};
export default connect(state => ({ language: state.preferences.language }), { setStartLanguage: preferencesAPI.setStartLanguage  } )(LanguageSelector);
