import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { loadTranslations } from '../../../../redux/PreferencesSlice';
import './LanguageSelector.scss';

import ukrainianFlag from '../../../../assets/ukrainianFlag.svg';
import ukFlag from '../../../../assets/ukFlag.svg';
import russianFlag from '../../../../assets/russianFlag.svg';

const LanguageSelector = ({ loadTranslations }) => {
  return (
      <div className='LanguageSelector'>
          <img onClick={() => loadTranslations('ukr')} className='language-icon' src={ukrainianFlag} alt='ukrainian' />
          <img onClick={() => loadTranslations('en')} className='language-icon' src={ukFlag} alt='english' />
          <img onClick={() => loadTranslations('ru')} className='language-icon' src={russianFlag} alt='russian' />
      </div>
  );
};
export default connect(state => ({ language: state.preferences.language }), { loadTranslations } )(LanguageSelector);
