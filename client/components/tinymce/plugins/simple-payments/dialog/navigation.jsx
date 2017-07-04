/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import SectionHeader from 'components/section-header';
import Button from 'components/button';

export default localize( class SimplePaymentsDialogNavigation extends Component {
	static propTypes = {
		activeTab: PropTypes.oneOf( [ 'paymentButtons', 'addNew' ] ).isRequired,
		onChangeTabs: PropTypes.func.isRequired
	};

	onChangeTabs = ( tab ) => () => this.props.onChangeTabs( tab );

	render() {
		const { activeTab, translate } = this.props;

		// TODO: Get from store/as a prop.
		const paymentButtons = [ 1 ];

		if ( activeTab === 'addNew' && ! paymentButtons.length ) {
			// We are on "Add New" view without previously made payment buttons.

			return null;
		} else if ( activeTab === 'addNew' ) {
			// We are on "Add New" view with previously made payment buttons.

			return <div>something</div>;
		} else {
			// We are on "Payment Buttons" view.

			return (
				<SectionHeader label={ translate( 'Payment Buttons' ) } count={ 2 }>
					<Button
						compact
						onClick={ this.onChangeTabs( 'addNew' ) }
					>
						{ translate( '+ Add New' ) }
					</Button>
				</SectionHeader>
			);
		}

	}
} );
