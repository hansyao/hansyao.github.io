

cat googlemapapi.json | jq -r | grep https:// | awk -F'"' '{print $2}' | awk -F'/' '{print $3}' | sort


curl https://maps.googleapis.com/maps/api/js\?key\=AIzaSyAfvMUKHfM57VuszF1rxFr_f4GjLNMSFtE | cat googlemapapi.json | jq -r | grep https:// | awk -F'"' '{print $2}' | awk -F'/' '{print $3}' | sort > googlemapdomain.txt

cat googlemapapi.js | grep "apiLoad(\[" | cut -d \( -f 2 | jq -r | grep https:// | awk -F'"' '{print $2}' | awk -F'/' '{print $3}' | sort -n | uniq > googlemapdomainlist.txt


curl -X POST https://maps.googleapis.com/maps/api/js\?key\=AIzaSyAfvMUKHfM57VuszF1rxFr_f4GjLNMSFtE | grep "apiLoad(\[" | cut -d \( -f 2 | jq -r | grep https:// | awk -F'"' '{print $2}' | awk -F'/' '{print $3}' | sort -n | uniq > googlemapdomainlist.txt

curl -X POST https://maps.googleapis.com/maps/api/js\?key\=AIzaSyAfvMUKHfM57VuszF1rxFr_f4GjLNMSFtE | grep "apiLoad(\[" | cut -d \( -f 2|sed 's/, loadScriptTime);//g' | jq -r | grep https:// | awk -F'"' '{print $2}' | awk -F'/' '{print $3}' | sort -n | uniq > googlemapdomainlist.txt


