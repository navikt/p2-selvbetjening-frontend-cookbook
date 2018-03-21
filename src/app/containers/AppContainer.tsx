import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import Spinner from 'nav-frontend-spinner';

import Intro from './../connected-components/intro/Intro';
import SøknadSendt from './../connected-components/soknad-sendt/SøknadSendt';
import IkkeMyndig from './../connected-components/feilsider/IkkeMyndig';
import ErMann from '../connected-components/feilsider/ErMann';
import PersonFinnesIkke from '../connected-components/feilsider/PersonFinnesIkke';
import SøknadContainer from './SøknadContainer';
import { erMann, erMyndig, harPersonData } from 'util/validation/validationUtils';

import { apiActionCreators as api } from '../redux/actions';
import { ExternalProps } from '../types';

import { DispatchProps } from '../redux/types';
import Person from '../types/domain/Person';
import { EngangsstonadSoknadResponse } from '../types/services/EngangsstonadSoknadResponse';

import '../styles/engangsstonad.less';

interface StateProps {
    soknad: EngangsstonadSoknadResponse;
    person: Person;
    reason: any;
    isLoadingPerson: boolean;
    godkjentVilkar: boolean;
    language: string;
}

type Props = StateProps & ExternalProps & DispatchProps & RouteComponentProps<{}>;

export class AppContainer extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    componentWillMount() {
        const { dispatch, person } = this.props;
        if (!person) {
                dispatch(api.getPerson());
            }
        }

    componentWillReceiveProps(props: any) {
        if (props.reason && props.reason.status === 401) {
            window.location.href = (window as any).LOGIN_URL + '?redirect=' + window.location.href;
        }
    }

    renderContent(children: React.ReactNode) {
        return (
            <div className="engangsstonad">
                {children}
            </div>
        );
    }

    getErrorRoutes(personErMann: boolean, personFinnes: boolean) {
        let component: any = IkkeMyndig;
        if (personErMann) {
            component = ErMann;
        } else if (!personFinnes) {
            component = PersonFinnesIkke;
        }

        return (
            <Switch>
                <Route path="/engangsstonad" component={component} />,
                <Redirect to="/engangsstonad" />
            </Switch>
        );
    }

    getSøknadRoutes() {
        const { godkjentVilkar, person, soknad } = this.props;
        return (
            <Switch>
                <Route path="/engangsstonad" component={Intro} exact={true} />
                {person && soknad && <Route path="/engangsstonad/completed" component={SøknadSendt} />}
                {godkjentVilkar === true && <Route path="/engangsstonad/soknad" component={SøknadContainer} />}
                <Redirect to="/engangsstonad" />
            </Switch>
        );
    }

    render() {
        const { person, isLoadingPerson } = this.props;

        if (isLoadingPerson || person === undefined) {
            return this.renderContent(<Spinner type="XXL"/>);
        }

        if (person) {
            const personFinnes = harPersonData(person);
            const personErMyndig = erMyndig(person);
            const personErMann = erMann(person);

            const personStateIsValid = personFinnes && personErMyndig && !personErMann;

            if (personStateIsValid) {
                return this.renderContent(this.getSøknadRoutes());
            }
            return this.renderContent(this.getErrorRoutes(personErMann, personFinnes));
        }
        return this.renderContent(this.getErrorRoutes(false, false));
    }
}

const mapStateToProps = (state: any) => ({
    reason: state.apiReducer.reason,
    person: state.apiReducer.person,
    soknad: state.apiReducer.soknad,
    isLoadingPerson: state.apiReducer.isLoadingPerson,
    godkjentVilkar: state.commonReducer.godkjentVilkar,
    language: state.commonReducer.language
});

export default withRouter(connect<StateProps, {}, {}>(mapStateToProps)(AppContainer));
