import { StyleSheet } from "react-native";
import { Avatar, Card, IconButton, customText } from "react-native-paper";

interface IProps {
    title: string;
    subtitle?: string;
    description?: string; //Will eventually some some sort of data overview
    type: string; //Used to determine icon
}

const Text = customText<'customVariant'>();

export default function ActivityCard(props: IProps) {
    //type === weighttraining -> icon="weight"
    return(
        <Card style={styles.card} mode='contained'>
          <Card.Title
            title={props.title}
            subtitle={props.subtitle}
            left={(props: any) => <Avatar.Icon {...props} icon="weight" />}
            //right={(props: any) => (
            //  <IconButton {...props} icon="dots-vertical" onPress={() => {}} />
            //)}
          />
          {props.description && 
            <Card.Content>
                <Text variant="bodyMedium">
                    {props.description}
                </Text>
            </Card.Content>}
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 4,
    },
    card: {
        marginHorizontal: 8,
        marginTop: 8,
    },
    chip: {
      margin: 4,
    },
    preference: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    button: {
      borderRadius: 12,
    },
  });