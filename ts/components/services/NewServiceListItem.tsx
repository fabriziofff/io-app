/**
 * A component to render the preview of a service
 * TODO:
 *     - make the badge being visible for new services: https://www.pivotaltracker.com/story/show/166761825
 */
import * as pot from "italia-ts-commons/lib/pot";
import { ListItem, Text, View } from "native-base";
import * as React from "react";
import { StyleSheet } from "react-native";

import I18n from "i18n-js";
import { ServicePublic } from "../../../definitions/backend/ServicePublic";
import { getEnabledChannelsForService } from "../../screens/preferences/common";
import { ProfileState } from "../../store/reducers/profile";
import customVariables from "../../theme/variables";
import H5 from "./../ui/H5";
import IconFont from "./../ui/IconFont";

type Props = Readonly<{
  item: pot.Pot<ServicePublic, Error>;
  profile: ProfileState;
  onSelect: (service: ServicePublic) => void;
  hasBadge?: boolean;
}>;

const ICON_SIZE = 24;

const styles = StyleSheet.create({
  spacingBase: {
    paddingRight: customVariables.spacingBase
  },
  flexRow: {
    flexDirection: "row"
  },
  serviceName: {
    flex: 1,
    fontWeight: "700"
  },
  listItem: {
    flexDirection: "column",
    paddingRight: customVariables.contentPadding,
    paddingLeft: customVariables.contentPadding,
    paddingTop: customVariables.spacerLargeHeight,
    paddingBottom: customVariables.spacerLargeHeight,
    borderBottomWidth: 0,
    borderTopWidth: 1 / 3,
    borderColor: "#c9c9c9",
    borderTopLeftRadius: customVariables.contentPadding,
    borderTopRightRadius: customVariables.contentPadding
  },
  center: {
    alignSelf: "center"
  },
  description: {
    paddingRight: ICON_SIZE,
    alignSelf: "flex-start"
  }
});

export class NewServiceListItem extends React.PureComponent<Props> {
  public render() {
    const potService = this.props.item;
    const onPress = pot.toUndefined(
      pot.map(potService, service => () => this.props.onSelect(service))
    );
    const enabledChannels = pot.map(potService, service =>
      getEnabledChannelsForService(this.props.profile, service.service_id)
    );

    const serviceName = pot.isLoading(potService)
      ? I18n.t("global.remoteStates.loading")
      : pot.isError(potService) || pot.isNone(potService)
        ? I18n.t("global.remoteStates.notAvailable")
        : potService.value.service_name;

    const inboxEnabledLabel = pot.getOrElse(
      pot.map(
        enabledChannels,
        _ =>
          _.inbox
            ? I18n.t("services.serviceIsEnabled")
            : I18n.t("services.serviceNotEnabled")
      ),
      undefined
    );

    return (
      <ListItem style={styles.listItem} onPress={onPress}>
        <View style={styles.flexRow}>
          {this.props.hasBadge && (
            <View style={styles.spacingBase}>
              {/*TODO: add BadgeComponent from https://www.pivotaltracker.com/story/show/167036251*/}
            </View>
          )}
          <H5 numberOfLines={2} style={styles.serviceName}>
            {serviceName}
          </H5>
          <IconFont
            style={styles.center}
            name={"io-right"}
            size={ICON_SIZE}
            color={customVariables.contentPrimaryBackground}
          />
        </View>
        {inboxEnabledLabel && (
          <Text numberOfLines={1} style={styles.description}>
            {inboxEnabledLabel}
          </Text>
        )}
      </ListItem>
    );
  }
}