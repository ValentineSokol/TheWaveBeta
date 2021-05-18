import React from 'react';
import { connect } from 'react-redux';
import { changeTranslations } from '../../../../redux/PreferencesSlice';
import './LanguageSelector.scss';

import ukrainianFlag from '../../../../assets/ukrainianFlag.svg';
import ukFlag from '../../../../assets/ukFlag.svg';
import russianFlag from '../../../../assets/russianFlag.svg';

const LanguageSelector = ({changeTranslations}) => {
  return (
      <div className='LanguageSelector'>
          <img onClick={() => changeTranslations('ukr')} className='language-icon' src={ukrainianFlag} alt='ukrainian' />
          <img onClick={() => changeTranslations('en')} className='language-icon' src={ukFlag} alt='english' />
          <img onClick={() => changeTranslations('ru')} className='language-icon' src={russianFlag} alt='russian' />
      </div>
  );
};
export default connect(state => ({ language: state.preferences.language }), { changeTranslations } )(LanguageSelector);
