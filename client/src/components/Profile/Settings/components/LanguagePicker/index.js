import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../../../../../redux/PreferencesSlice';

import './LanguagePicker.scss';
import ukFlag from '../../../../../assets/icons/ukFlag.svg';
import ukraineFlag from '../../../../../assets/icons/ukrainianFlag.svg';


const LanguagePicker = ({ setStartLanguage }) => {
  const flags = [{ src: ukraineFlag, language: 'ukr' }, { src: ukFlag, language: 'en' }];

  const onFlagClick = (e) => {
      setStartLanguage(e.target.dataset.language);
  };

  return(<div className='LanguagePicker'>
      {flags.map(flag => <img data-language={flag.language} alt='languageButton' src={flag.src} onClick={onFlagClick} />)}
  </div>);
};

export default connect(null, { ...actions })(LanguagePicker);