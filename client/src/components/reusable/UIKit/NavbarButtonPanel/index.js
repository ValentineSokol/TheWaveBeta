import React from 'react';
import { connect } from 'react-redux';
import { actions as preferencesAPI } from '../../../../redux/PreferencesSlice';
import './NavbarButtonPanel.scss';

import ukrainianFlag from '../../../../assets/icons/ukrainianFlag.svg';
import ukFlag from '../../../../assets/icons/ukFlag.svg';
import russianFlag from '../../../../assets/icons/russianFlag.svg';
// import settingsIcon from '../../../../assets/settings.svg';
import {Link} from 'react-router-dom';

const NavbarButtonPanel = ({ setStartLanguage }) => {
  return (
      <div className='NavbarButtonPanel'>
          <img onClick={() => setStartLanguage('ukr')} className='language-icon' src={ukrainianFlag} alt='ukrainian' />
          <img onClick={() => setStartLanguage('en')} className='language-icon' src={ukFlag} alt='english' />
          <img onClick={() => setStartLanguage('ru')} className='language-icon' src={russianFlag} alt='russian' />
      </div>
  );
};
export default connect(state => ({ language: state.preferences.language }), { setStartLanguage: preferencesAPI.setStartLanguage  } )(NavbarButtonPanel);
