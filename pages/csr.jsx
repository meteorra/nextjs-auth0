import React, { useEffect, useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Auth0Client } from '@auth0/auth0-spa-js';

export default withPageAuthRequired(function SSRPage() {

  const [exportToken, setExportToken] = useState('');
  const [algoliaKeysToken, setAlgoliaKeysToken] = useState('');

  const [exportApi, setExportApi] = useState('');
  const [algoliaKeysApi, setAlgoliaKeysApi] = useState('');


  useEffect(() => {
    //if you do this, you'll need to check the session yourself
    const func = async() => {
      const auth0 = new Auth0Client({
        domain: 'https://dev-a5ktl21utephrnaj.us.auth0.com',
        clientId: '40KrB3szYXNSJGhaDgWM68Z734qqT6X7',
        authorizationParams: {
          redirect_uri: 'https://nextjs-auth0-1jwc.vercel.app/api/auth/callback'
        }
      });

      try {
        const exportToken = await auth0.getTokenSilently({
          authorizationParams: {
            audience: 'http://localhost:3001/api/export',
            // scope: "read:export",
          }
        });
        setExportToken(exportToken)
        const exportApiJson = await fetch('http://localhost:3001/api/export', {
          headers: {
            "Authorization": `Bearer ${exportToken}`
          }
        })
        const exportApi = await exportApiJson.json()
        setExportApi(exportApi.msg)

        const algoliaKeysToken = await auth0.getTokenSilently({
          authorizationParams: {
            audience: 'http://localhost:3001/api/algolia-keys',
            // scope: "read:keys",
          }
        });
        setAlgoliaKeysToken(algoliaKeysToken)
        // const algoliaKeysApiJson = await fetch('http://localhost:3001/api/algolia-keys', {
        //   headers: {
        //     "Authorization": `Bearer ${algoliaKeysToken}`
        //   }
        // })
        // const algoliaKeysApi = await algoliaKeysApiJson.json()
        // setAlgoliaKeysApi(algoliaKeysApi.msg)
      } catch (error) {
        console.log('Err', error)
        if (error.error !== 'login_required') {
          throw error;
        }
      }
    }

    func()
    
  }, [setExportToken, setAlgoliaKeysToken, exportApi, algoliaKeysApi])



  return (
    <>
      <div className="mb-5" data-testid="csr">
        <h1 data-testid="csr-title">Client-side Rendered Page</h1>
        <div data-testid="csr-text">
          <p>
            Export token: {exportToken}<br />
            Algolia keys token: {algoliaKeysToken}<br />
            Export api response: {exportApi}<br />
            Algolia api response: {algoliaKeysApi}<br />
            You can protect a client-side rendered page by wrapping it with <code>withPageAuthRequired</code>. Only
            logged in users will be able to access it. If the user is logged out, they will be redirected to the login
            page instead.
          </p>
          <p>
            Use the <code>useUser</code> hook to access the user profile from protected client-side rendered pages. The{' '}
            <code>useUser</code> hook relies on the <code>UserProvider</code> Context Provider, so you need to wrap your
            custom <a href="https://nextjs.org/docs/advanced-features/custom-app">App Component</a> with it.
          </p>
          <p>
            You can also fetch the user profile by calling the <code>/api/auth/me</code> API route.
          </p>
        </div>
      </div>
    </>
  );
});
