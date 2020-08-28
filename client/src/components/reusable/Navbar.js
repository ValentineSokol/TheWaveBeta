import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/async';
import '../../css/Navbar.css';
import logo from '../../img/navlogo.png';
class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onLogout = () => this.props.dispatch(logout());
  render() {
    const { user } = this.props;
    return (
        <div className="Navbar">
          <ul className="NavbarItems">
            <img className='NavbarLogo' src={logo} alt="logo"/>
            <li><Link to='/'>Home</Link></li>
            {
              user && user.isLoggedIn?
              <>
              <li><Link to={`/profile/${user.userId}`}>Profile</Link></li>
              <li><Link to='/story/add'>Post story</Link></li>
              <li><Link to='/search'>Search</Link></li>
              <li onClick={this.onLogout} className='NavbarLogout'>Log Out</li>
              </>  
              :
              <>
                <li><Link to='/register'>Register</Link></li>
              </>
              
            }        
          </ul>  

        </div>
    );
  }
}
const mapStateToProps = (state) => ({ user: state.global.user });
export default connect(mapStateToProps, null)(Navbar);