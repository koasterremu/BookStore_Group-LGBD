import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';

const Apps = ({ match }) => (
  <Suspense fallback={<Loading cover="content"/>}>
    <Switch>
      {/* <Route path={`${match.url}/chat`} component={lazy(() => import(`./chat`))} /> */}
      <Route path={`${match.url}/category`} component={lazy(() => import(`./category`))} />
      <Route path={`${match.url}/brand`} component={lazy(() => import(`./brand`))} />
      <Route path={`${match.url}/product`} component={lazy(() => import(`./product`))} />
      <Route path={`${match.url}/new`} component={lazy(() => import(`./new`))} />
      <Route path={`${match.url}/voucher`} component={lazy(() => import(`./voucher`))} />
      <Route path={`${match.url}/review`} component={lazy(() => import(`./review`))} />
      <Route path={`${match.url}/user`} component={lazy(() => import(`./user`))} />
      <Route path={`${match.url}/order`} component={lazy(() => import(`./order`))} />
      <Redirect from={`${match.url}`} to={`${match.url}/default`} />
    </Switch>
  </Suspense>
);

export default Apps;