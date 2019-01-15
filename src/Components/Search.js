import React from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql `
    query SEARCH_ITEMS_QUERY ($searchTerm: String!) {
        items (
            where:{
                OR :[{title_contains: $searchTerm}, {description_contains:$searchTerm}]
            })
            {
                id
                image
                title
            }
    }
`;
function routeToItem(item) {
    Router.push({
      pathname: '/item',
      query: {
        id: item.id,
      },
    });
  }

  class AutoComplete extends React.Component {
      state = {
          items: [],
          loading: false,
      };


      onChange = debounce(async(e, client) => {
          console.log('searching...');
          //turn loading on
          this.setState({loading:true});
          //manually query apollo client
          const res = await client.query({
              query: SEARCH_ITEMS_QUERY,
              variables: {searchTerm: e.target.value},
          });
          this.setState({
              items: res.data.items,//res.data.the items referred
              loading: false,
          });
      }, 350 );

    render() {
        resetIdCounter();

        return(
            <SearchStyles>
                <Downshift onChange={routeToItem} itemToString={item => (item ===null ? '' : item.title)}>
                
                </Downshift>
            </SearchStyles>

        );

    }

  }
  