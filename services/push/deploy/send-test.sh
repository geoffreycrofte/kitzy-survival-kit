#!/bin/sh
# Envoi d'essai, lancé sur le VPS avec les mêmes droits que le service :
#   sudo /opt/kitzy-push/services/push/deploy/send-test.sh         le dernier appareil abonné
#   sudo /opt/kitzy-push/services/push/deploy/send-test.sh --all   tous les appareils
exec systemd-run --quiet --pipe --wait --collect \
  -p User=kitzy -p Group=kitzy \
  -p EnvironmentFile=/etc/kitzy-push.env \
  -p Environment=DB_PATH=/var/lib/kitzy-push/push.sqlite \
  -p WorkingDirectory=/opt/kitzy-push/services/push \
  /usr/bin/node --disable-warning=ExperimentalWarning scripts/send-test.ts "$@"
