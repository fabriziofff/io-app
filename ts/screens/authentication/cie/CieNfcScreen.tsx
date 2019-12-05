import { Container, H1, Text, View } from "native-base";
import * as React from "react";
import { StyleSheet, NavState } from "react-native";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import ScreenHeader from "../../../components/ScreenHeader";
import BaseScreenComponent from "../../../components/screens/BaseScreenComponent";
import FooterWithButtons from "../../../components/ui/FooterWithButtons";
import I18n from "../../../i18n";
import ROUTES from "../../../navigation/routes";
import variables from "../../../theme/variables";
import { isNfcEnabled, openNFCSettings } from "../../../utils/cie";

type Props = Readonly<{
  navigation: NavigationScreenProp<NavigationState>;
}>;

type State = {
  isNfcEnabled: boolean;
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: variables.contentPadding
  },
  text: {
    fontSize: variables.fontSizeBase
  }
});

export class CieNfcScreen extends React.Component<Props, State> {
  private idInterval?: number;
  constructor(props: Props) {
    super(props);
  }

  private renderFooter = () => {
    if (this.state.isNfcEnabled) {
      return (
        <FooterWithButtons
          type={"TwoButtonsInlineThird"}
          leftButton={{
            cancel: true,
            onPress: this.props.navigation.goBack,
            title: I18n.t("global.buttons.cancel"),
            block: true
          }}
          rightButton={{
            cancel: false,
            onPress: this.handleOnPressContinue,
            title: I18n.t("global.buttons.continue"),
            block: true
          }}
        />
      );
    } else {
      return (
        <FooterWithButtons
          type={"TwoButtonsInlineThird"}
          leftButton={{
            cancel: true,
            onPress: this.props.navigation.goBack,
            title: I18n.t("global.buttons.cancel"),
            block: true
          }}
          rightButton={{
            cancel: false,
            onPress: undefined,
            title: I18n.t("authentication.cie.enableNfcTitle"),
            block: true
          }}
        />
      );
    }
  };

  private handleNavigationStateChange = (event: NavState): void => {
    if (event.url && event.url.indexOf("OpenApp") !== -1) {
    }
  };

  private renderWebView() {
    return (
      <WebView
        thirdPartyCookiesEnabled={true}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        onError={this.handleError}
        onNavigationStateChange={this.handleNavigationStateChange}
        source={{
          uri: this.state.webUrl
        }}
      />
    );
  }
  public render(): React.ReactNode {
    const heading = this.state.isNfcEnabled
      ? I18n.t("authentication.cie.nfcEnabledTitle")
      : I18n.t("authentication.cie.enableNfcTitle");

    const content = this.state.isNfcEnabled
      ? I18n.t("authentication.cie.nfcEnabledContent")
      : I18n.t("authentication.cie.enableNfcContent");

    return (
      <Container>
        <BaseScreenComponent goBack={true} />
        {this.renderFooter()}
        {this.renderWebView()}
      </Container>
    );
  }
}
