import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import * as countries from 'i18n-iso-countries';
const bokmalCountryList = require('i18n-iso-countries/langs/nb.json');
const nynorskCountryList = require('i18n-iso-countries/langs/nn.json');

const { Select } = require('nav-frontend-skjema');
const { Undertittel, Element } = require('nav-frontend-typografi');
const Modal = require('nav-frontend-modal').default;
const { Knapp, Hovedknapp } = require('nav-frontend-knapper');

import DateInput from 'components/date-input/DateInput';
import getMessage from 'util/i18n/i18nUtils';
import { Periode } from '../../types/domain/Utenlandsopphold';

interface OwnProps {
    language: string;
    utenlandsopphold?: Periode;
    onSubmit: (periode: Periode) => void;
    closeModal: () => void;
}
type Props = OwnProps & InjectedIntlProps;

interface State {
    titleText?: string;
    submitButtonText?: string;
    utenlandsopphold?: Periode;
}

class CountryModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const countriesLanguage = props.language === 'nb' ? bokmalCountryList : nynorskCountryList;
        countries.registerLocale(countriesLanguage);

        const { intl, utenlandsopphold } = props;
        if (utenlandsopphold) {
            this.state = {
                titleText: getMessage(intl, 'medlemmskap.modal.overskrift'),
                submitButtonText: getMessage(intl, 'medlemmskap.modal.lagreEndringer'),
                utenlandsopphold
            };
        } else {
            this.state = {
                titleText: getMessage(intl, 'medlemmskap.modal.overskrift'),
                submitButtonText: getMessage(intl, 'medlemmskap.knapp.leggTilLand')
            };
        }
    }

    renderSelectOptions() {
        const { language } = this.props;
        return Object.entries(countries.getNames(language))
            .sort((a: string[], b: string[]) => a[1].localeCompare(b[1], language))
            .map((optionValue: string[]) => (
                <option key={optionValue[0]} value={optionValue[0]}>
                    {optionValue[1]}
                </option>
            ));
    }

    onSubmit() {
        const { fom, tom, land } = (this.state.utenlandsopphold as Periode);
        if (land !== undefined && fom !== undefined && tom !== undefined) {
            const visit: Periode = { land, fom, tom };
            this.props.onSubmit(visit);
        }
    }

    render() {
        const { intl } = this.props;
        const { utenlandsopphold } = this.state;
        const landValue = utenlandsopphold ? utenlandsopphold.land : '';
        const fomValue = utenlandsopphold ? utenlandsopphold.fom : '';
        const tomValue = utenlandsopphold ? utenlandsopphold.tom : '';

        return (
            <Modal
                isOpen={true}
                contentLabel="landvelger"
                closeButton={false}
                onRequestClose={() => {
                    this.props.closeModal();
                }}
            >
                <div>
                    <Undertittel className="countryModal__title">{this.state.titleText}</Undertittel>
                    <Element>{getMessage(intl, 'medlemmskap.text.jegBodde')}</Element>
                    <Select
                        label=""
                        onChange={
                            (e: React.ChangeEvent<HTMLSelectElement>) =>
                                this.setState({
                                    utenlandsopphold: {
                                        land: e.target.value,
                                        fom: fomValue,
                                        tom: tomValue
                                    }
                                })
                        }
                        defaultValue={landValue}
                    >
                        <option value="" />
                        {this.renderSelectOptions()}
                    </Select>
                    <DateInput
                        id="boddFraDato"
                        inputProps={{ value: fomValue }}
                        selectedDate={fomValue}
                        label={getMessage(intl, 'standard.text.fra')}
                        onChange={(date: string) => {
                            this.setState({
                                utenlandsopphold: {
                                    land: landValue,
                                    tom: tomValue,
                                    fom: date
                                }
                            });
                        }}
                    />
                    <DateInput
                        id="boddTilDato"
                        label={getMessage(intl, 'standard.text.til')}
                        inputProps={{ value: tomValue }}
                        selectedDate={tomValue}
                        onChange={(date: string) => {
                            this.setState({
                                utenlandsopphold: {
                                    land: landValue,
                                    tom: date,
                                    fom: fomValue
                                }
                            });
                        }}
                    />
                    <div className="countryModal__buttonBar">
                        <Knapp onClick={() => this.props.closeModal()} htmlType="button">
                            {getMessage(intl, 'medlemmskap.modal.avbryt')}
                        </Knapp>
                        <Hovedknapp onClick={() => utenlandsopphold && this.onSubmit()} htmlType="button">
                            {this.state.submitButtonText}
                        </Hovedknapp>
                    </div>
                </div>
            </Modal>
        );
    }
}
export default injectIntl(CountryModal);