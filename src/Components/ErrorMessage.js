import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const ErrorStyles = styled.div `
    padding:2rem;
    background:white;
    margin: 2rem 0;
    border: 1px solid rgba(0,0,0,0.5);
    border-left: 5px solid red;
    p{
        margin:0;
        font-weight:100;
    }
    strong {
        margin-right:1rem;
    }
`;

const DisplayError = ({error}) => {
    if (!error || !error.message) return null;
     //network error
    if (error.networdError && error.networdError.result && error.networdError.result.errors.length) {
       return error.networdError.result.errors.map((error, i) => (
            <ErrorStyles key={i}>
                <p data-test="graphql-error">
                    <strong>Shoot!</strong>
                    {error.message.replace('GraphQL error: ', '')}
                </p>
            </ErrorStyles>
       ));
    }
    return (
        <ErrorStyles>
            <p data-test="graphql-error">
                <strong>Shoot!</strong>
                {error.message.replace('GraphQL error: ', '')}
            </p>
        </ErrorStyles>
    );
};

    DisplayError.defaultProps ={
        error:{},
    };

    DisplayError.prototypes = {
        error: PropTypes.object,
    };
    
    export default DisplayError;
    
