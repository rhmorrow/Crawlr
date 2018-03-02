/*                    index
search    map      crawlentrylist       searchlist
                    crawlentry          searchitem

index has handleSearch -> passed to search
      has handlesearchitemADDclick -> passed to searchlist, then searchitem
      has handlemapmarkerADDclick -> passed to map
        has state that on marker/searchitem click, changes which tells crawlentry to add new item

search has handleinput change

map has api stuffz

searchlist passes handlesearchitemclick to searchitem

crawlentry is generated when info from index state changes by click from searchitem or map
*/

import React from 'react';
import ReactDOM from 'react-dom';
import Search from './Search.jsx';
import MapView from './MapView.jsx';
import CrawlEntryList from './CrawlEntryList.jsx';
import CrawlCreateForm from './CrawlCreateForm.jsx'
import SearchList from './SearchList.jsx';
import MapContainer from './MapContainer.jsx';
import DirectionsMap from './DirectionsMap.jsx';
import LoginView from "./LoginView.jsx"
import SignupView from "./SignupView.jsx"
import $ from 'jquery';
import { Grid, Menu } from 'semantic-ui-react';
import LandingPage from './LandingPage.jsx';
import FindPage from './FindPage.jsx';
import HomePage from './HomePage.jsx';

// let intialBars =

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topCrawlsList: [],
      findSearch: '',
      crawlList: [],
      barAdded: [],
      searchValue: '',
      barList: [],
      location: {lat: 30.2672, lng: -97.7431},
      activeItem: 'home',
      landingPageView: true,
      crawlListView: false,
      directionMapView: false
    }
    this.handleSearch = this.handleSearch.bind(this);
    this.handleBarAdd = this.handleBarAdd.bind(this);
    this.handleBarRemove = this.handleBarRemove.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleUserCreation = this.handleUserCreation.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
    this.createCrawl = this.createCrawl.bind(this);
    this.saveCrawl = this.saveCrawl.bind(this);
    this.cancelCrawl = this.cancelCrawl.bind(this);
    this.handleFindSearch = this.handleFindSearch.bind(this);
  }

  handleSearch (searchText) {
    console.log('hit handlesearch in index.jsx, searchtext is:', searchText);
    //set searchvalue state to search
    this.setState({searchValue: searchText});
    //do post request to server with search value
    let location = {location: searchText}
    $.post('/Search', location, (data) => {

      this.setState({
        barList: data.barList || [],
        location: data.coor,
        landingPageView: false
      });
    });
  }

handleFindSearch (searchText) {
    console.log('hit handlesearch in find.jsx, searchtext is:', searchText);
    //set searchvalue state to search
    this.setState({findSearch: searchText});
    //do post request to server with search value
    let location = {city: searchText}
    $.post('/FindCrawls', location, (data) => {

      this.setState({
        crawlList: data.crawlList
      });
    });
  }

  handleBarAdd(bar) {
    var newBarList = this.state.barAdded;
    newBarList.push(bar);
    this.setState({
      barAdded: newBarList,
      crawlListView: true
    })
  }
  handleBarRemove(e) {
    var newBarList = this.state.barAdded;
    newBarList.splice(e.target.name, 1)
    this.setState({
      barAdded: newBarList
    })
  }
  handleMenuClick(e, { name }) {
    console.log('hit menu click e is', name)
    this.setState({
      activeItem: name
    })
  }
  handleButtonClick(e) {
    console.log('hit menu click e is', e.target.parentNode.name);
    this.setState({
      activeItem: e.target.parentNode.name || "home"
    })
  }
  handleUserCreation(e) {
    e.preventDefault();
    const name = $(".username").val();
    const pw = $(".password").val();
    const newuser = {username: name, password: pw};
    $.post('/signup', newuser, () =>
    console.log('user ' + name + ' created'));
    this.setState({
      activeItem: 'home'
    })
  }

  handleAuth(e) {
    e.preventDefault();
    const name = $(".username").val();
    const pw = $(".password").val();
    const thisuser = {username: name, password: pw};
    $.post('/login', thisuser, () =>
    console.log('Welcome, ' + name));
    this.setState({
      activeItem: 'home'
    })
  }

  createCrawl() {
    console.log('post request sent');
    this.setState({
      directionMapView: true,
      crawlListView: false
    })
  }

  saveCrawl(e) {
    e.preventDefault();
    const crawlname = $("#crawl-name").val();
    const crawldesc = $("#crawl-description").val();
    console.log('crawl saved. Name: ' + crawlname + ' Bar List: ' + this.state.barAdded)
    const crawl = {
      name: crawlname,
      description: crawldesc,
      bars: this.state.barAdded
    }
    $.post('/create', crawl, () => {
      console.log(success);
    });
    this.setState({
      barAdded: [],
      barList: [],
      location: {},
      activeItem: "home",
      landingPageView: true,
      directionMapView: false
    })
  }

  cancelCrawl() {
    this.setState({
      directionMapView: false,
      crawlListView: true
    })
  }

  render() {
    const { activeItem } = this.state.activeItem
    return (
      <div>
      <Grid celled>
        <Grid.Row>
          <Grid.Column width={4}>
            <h1>Crawlr</h1>
            <h3>A Pub Crawl Creator</h3>
          </Grid.Column>
          <Grid.Column width={9}>
          </Grid.Column>
          <Grid.Column width={3}>
              <h3>Account</h3>
              <button
                className="ui animated button"
                role="button"
                name="login"
                onClick={this.handleButtonClick}>
                <div name="login" className="visible content">
                  <i aria-hidden="true" className="user profile icon"></i>
                </div>
                <div name="login" className="hidden content">Log In</div>
              </button>
              <button
                className="ui animated button"
                role="button"
                name="signup"
                onClick={this.handleButtonClick}>
                <div name="signup" className="visible content">
                  <i aria-hidden="true" name="signup" className="user add icon"></i>
                </div>
                <div name="signup" className="hidden content">Sign Up!</div>
              </button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
          <Menu>
            <Menu.Item
              name='home'
              active={this.state.activeItem === 'home'}
              onClick={this.handleMenuClick}
            >
            Home
            </Menu.Item>
            <Menu.Item
              name='find'
              active={this.state.activeItem === 'find'}
              onClick={this.handleMenuClick}
            >
            Find a Crawl
            </Menu.Item>
            <Menu.Item
              name='create'
              active={this.state.activeItem === 'create'}
              onClick={this.handleMenuClick}
            >
            Create a Crawl
            </Menu.Item>
          </Menu>
          </Grid.Column>
        </Grid.Row>
        {this.state.activeItem == 'login' &&
        <LoginView submit={this.handleAuth} />
        }
        {this.state.activeItem == 'signup' &&
        <SignupView submit={this.handleUserCreation} />
        }


        {this.state.activeItem === 'home' &&
        <Grid celled>
        <Grid.Row>
        <HomePage onMenuClick={this.handleMenuClick} topCrawls={this.state.topCrawlsList}/>
        </Grid.Row>
        </Grid>
        }


        {this.state.activeItem === 'find' &&
        <Grid celled>
        <Grid.Row>
        <FindPage onSubmit={this.handleFindSearch} crawls={this.state.crawlList}/>
        </Grid.Row>
        </Grid>
        }



        {this.state.activeItem === 'create' &&
        <Grid celled>
        <Grid.Row>
          <Grid.Column width={7}>
          <h3>First, enter your city of choice!</h3>
          <Search onSubmit={this.handleSearch}/>
          </Grid.Column>
          <Grid.Column width={5}>

        </Grid.Column>
        </Grid.Row>
        <Grid.Row>
        <Grid.Column width={11}>
          {this.state.landingPageView && <LandingPage />}
          {!this.state.directionMapView && !this.state.landingPageView && <MapContainer addbar={this.handleBarAdd} barlist={this.state.barList} baradded={this.state.barAdded} location={this.state.location} />}
          {this.state.directionMapView && <DirectionsMap crawlBars={this.state.barAdded} />}
        </Grid.Column>
        <Grid.Column width={5}>
          {!this.state.landingPageView && !this.state.directionMapView && !this.state.crawlListView && !this.state.barAdded.length && <div><h4>Double click on a marker to start adding bars to your crawl!</h4></div>}
          {this.state.crawlListView && <CrawlEntryList removebar={this.handleBarRemove} barAdded={this.state.barAdded} createCrawl={this.createCrawl} />}
          {this.state.directionMapView && <CrawlCreateForm barAdded={this.state.barAdded} cancelcrawl={this.cancelCrawl} savecrawl={this.saveCrawl} />}
        </Grid.Column>
        </Grid.Row>
        </Grid>
      }
      </Grid>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));