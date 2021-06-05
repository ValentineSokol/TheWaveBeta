import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loadTranslationForComponent } from '../../../redux/PreferencesSlice';

export default (ComponentToTranslate, translationKey, mapStateToProps, mapDispatchToProps = {}, noLoaders = false) => {
 const mapState = state => {
  const defaultPayload = { language: state.preferences.language, translation: state.preferences.translations[translationKey] };
   return mapStateToProps ? {...mapStateToProps(state), ...defaultPayload } : defaultPayload;
 };
 const mapDispatch = { ...mapDispatchToProps, loadTranslationForComponent };

 class TranslationProvider extends Component {
  loadTranslation() {
   this.props.loadTranslationForComponent({ translationKey, language: this.props.language });
  }
  componentDidMount() {
   if (!this.props.language) return;
   this.loadTranslation();
  }

  componentDidUpdate(prevProps) {
   if (prevProps.language === this.props.language) return;
   this.loadTranslation();
  }

  render() {
   const { translation } = this.props;
   const componentProps = {...this.props };
   delete componentProps.loadTranslationForComponent;
   delete componentProps.language;
   return translation || noLoaders? <ComponentToTranslate {...componentProps} /> : <p>Loading....</p>
  }

 }
 return connect(mapState, mapDispatch)(TranslationProvider);
}