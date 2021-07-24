import React from 'react';
import { actions } from '../../../redux/PreferencesSlice/index'
import withTranslation from '../../reusable/withTranslation';
import Heading from '../../reusable/UIKit/Headings/Heading/Heading';

import './Settings.scss';

class Settings extends React.Component {

    applySettings = (e) => {
        const { settings, applySettings } = this.props;
        const newSettingValue = e.target.type !== 'checkbox' ? e.target.value : e.target.checked;
        applySettings({ ...settings, [e.target.name]: newSettingValue });
    }
    render() {
        const { translation } = this.props;
        return(
          <div className='SettingsContainer'>
              <Heading>{translation.heading}</Heading>
              <section className='SettingsSection'>
                  <Heading size='3'>{translation.sections.notifications.heading}</Heading>
                  <label>{translation.sections.notifications.allowSound}</label>
                  <input name='notificationSound' onChange={this.applySettings} type='checkbox' defaultChecked={this.props.settings?.notificationSound}/>
              </section>
          </div>
        );
    }
}

const mapState = state => ({ settings: state.preferences });
const mapDispatch = { applySettings: actions.applySettings };
export default withTranslation(Settings, 'settings', mapState, mapDispatch);
