import os
import pickle

import tbaapiv3client
from tbaapiv3client.rest import ApiException

TBA_READ_KEY = os.environ["TBA_READ_KEY"]
TEAM_KEY = "frc2767"

configuration = tbaapiv3client.Configuration(
    host="https://www.thebluealliance.com/api/v3",
    api_key={"X-TBA-Auth-Key": TBA_READ_KEY},
)

year = 2024

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['X-TBA-Auth-Key'] = 'Bearer'

# Enter a context with an instance of the API client
with tbaapiv3client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    event_api = tbaapiv3client.EventApi(api_client)
    team_api = tbaapiv3client.TeamApi(api_client)

    try:
        # api_response = api_instance.get_team_event_status(team_key, event_key)
        events = event_api.get_team_events_by_year(TEAM_KEY, year)
        awards = team_api.get_team_awards_by_year(TEAM_KEY, year)
        results = team_api.get_team_events_statuses_by_year(TEAM_KEY, year)
    except ApiException as e:
        print("Exception when calling TeamApi->get_team_event_status: %s\n" % e)

data = dict(awards=awards, events=events, results=results)

with open(f"{year}_data.pickle", "wb") as f:
    pickle.dump(data, f, protocol=pickle.HIGHEST_PROTOCOL)
