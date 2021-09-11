const ConditionalView = ({condition, positiveView, negativeView}) => condition ? positiveView : negativeView;

export default ConditionalView;