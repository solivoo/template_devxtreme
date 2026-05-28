import Button from 'devextreme-react/button';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import LoadPanel from 'devextreme-react/load-panel';
import type {
  EquipmentSheet,
  GeneralDataField,
  RecentEvent,
  TechnicalParameter,
} from '../../types/equipmentSheet.ts';
import { AlertWarningIcon, InfoSectionIcon } from './components/SectionIcons.tsx';
import styles from './EquipmentSheetPage.module.css';
import { useEquipmentSheet } from './hooks/useEquipmentSheet.ts';

const MaintenanceCards = ({ sheet }: { sheet: EquipmentSheet }) => (
  <div className={styles.maintenanceRow}>
    <article className={`${styles.maintenanceCard} ${styles.maintenanceCardLast}`}>
      <p className={styles.maintenanceCardHeader}>ÚLTIMO MANTENIMIENTO</p>
      <div className={styles.maintenanceCardBody}>
        <div>
          <p className={styles.maintenanceMetricLabel}>FECHA</p>
          <p className={styles.maintenanceMetricValue}>{sheet.lastMaintenance.date}</p>
        </div>
        <div>
          <p className={styles.maintenanceMetricLabel}>KILOMETRAJE</p>
          <p className={styles.maintenanceMetricValue}>{sheet.lastMaintenance.mileage}</p>
        </div>
      </div>
    </article>
    <article className={`${styles.maintenanceCard} ${styles.maintenanceCardNext}`}>
      <p className={styles.maintenanceCardHeader}>PRÓXIMO MANTENIMIENTO</p>
      <div className={styles.maintenanceCardBody}>
        <div>
          <p className={styles.maintenanceMetricLabel}>FECHA ESTIMADA</p>
          <p className={styles.maintenanceMetricValue}>
            {sheet.nextMaintenance.estimatedDate}
          </p>
        </div>
        <div>
          <p className={styles.maintenanceMetricLabel}>LÍMITE (KM)</p>
          <p className={styles.maintenanceMetricValue}>{sheet.nextMaintenance.limitKm}</p>
        </div>
      </div>
    </article>
  </div>
);

interface DataFieldProps {
  field: GeneralDataField;
  valueClassName?: string;
}

const DataField = ({ field, valueClassName }: DataFieldProps) => (
  <div className={styles.field}>
    <dt className={styles.fieldLabel}>{field.label}</dt>
    <dd className={`${styles.fieldValue} ${valueClassName ?? ''}`.trim()}>{field.value}</dd>
  </div>
);

const GeneralDataSection = ({ sheet }: { sheet: EquipmentSheet }) => {
  const { generalData } = sheet;

  return (
    <section className={`${styles.card} ${styles.generalCard}`}>
      <header className={styles.generalCardHeader}>
        <div className={styles.alert} role="status">
          <AlertWarningIcon className={styles.alertIcon} />
          <p>{sheet.alertMessage}</p>
        </div>
        <div className={styles.generalCardTitleRow}>
          <InfoSectionIcon className={styles.generalCardTitleIcon} />
          <p className={styles.generalCardTitle}>Datos Generales</p>
        </div>
        <hr className={styles.generalCardDivider} />
      </header>
      <div className={styles.cardBody}>
        <div className={styles.generalOverview}>
          {generalData.overview.map((field) => (
            <DataField key={field.label} field={field} />
          ))}
        </div>
        <div className={styles.generalDetailsGrid}>
          <div className={styles.generalDetailsCol}>
            {generalData.detailsLeft.map((field) => (
              <DataField key={field.label} field={field} />
            ))}
          </div>
          <div className={styles.generalDetailsCol}>
            {generalData.detailsRight.map((field) => (
              <DataField key={field.label} field={field} />
            ))}
          </div>
        </div>
        <div className={styles.generalFooter}>
          <div className={styles.field}>
            <dt className={styles.fieldLabel}>Otros</dt>
            <dd className={`${styles.fieldValue} ${styles.fieldValueMuted}`}>
              {generalData.others}
            </dd>
          </div>
          <div className={styles.field}>
            <dt className={styles.fieldLabel}>Ubicación detallada</dt>
            <dd className={styles.fieldValue}>{generalData.detailedLocation}</dd>
          </div>
          <div className={styles.field}>
            <dt className={styles.fieldLabel}>Descripción</dt>
            <dd className={styles.description}>{generalData.description}</dd>
          </div>
        </div>
      </div>
    </section>
  );
};

const TechnicalParametersGrid = ({ rows }: { rows: TechnicalParameter[] }) => (
  <section className={`${styles.card} ${styles.technicalCard}`}>
    <header className={styles.technicalCardHeader}>
      <div className={styles.generalCardTitleRow}>
        <InfoSectionIcon className={styles.generalCardTitleIcon} />
        <p className={styles.generalCardTitle}>Parámetros Técnicos</p>
      </div>
      <hr className={styles.generalCardDivider} />
    </header>
    <div className={styles.gridHost}>
      <DataGrid dataSource={rows} keyExpr="id" showBorders>
        <Column dataField="characteristic" caption="CARACTERÍSTICA" />
        <Column dataField="value" caption="VALOR" alignment="center" />
        <Column dataField="unit" caption="UNIDAD" alignment="right" />
      </DataGrid>
    </div>
  </section>
);

const timelineDotClass: Record<RecentEvent['variant'], string> = {
  success: styles.timelineDotSuccess,
  info: styles.timelineDotInfo,
  neutral: styles.timelineDotNeutral,
};

const Sidebar = ({ sheet }: { sheet: EquipmentSheet }) => (
  <aside className={styles.sidebar}>
    <nav className={styles.actionsBlock} aria-label="Enlaces rápidos">
      {sheet.actions.map((action) => (
        <Button
          key={action.id}
          className={styles.actionDxButton}
          text={action.label}
          icon={action.icon}
          stylingMode="outlined"
          type="normal"
          width="100%"
          onClick={() => undefined}
        />
      ))}
    </nav>
    <section className={`${styles.card} ${styles.eventsCard}`}>
      <p className={styles.eventsCardTitle}>Eventos Recientes</p>
      <ul className={styles.timeline}>
        {sheet.recentEvents.map((event) => (
          <li key={event.id} className={styles.timelineItem}>
            <span
              className={`${styles.timelineDot} ${timelineDotClass[event.variant]}`}
              aria-hidden
            >
              {event.variant === 'success' ? '✓' : '●'}
            </span>
            <p className={styles.timelineTitle}>{event.title}</p>
            <p className={styles.timelineDate}>{event.date}</p>
          </li>
        ))}
      </ul>
    </section>
  </aside>
);

export const EquipmentSheetPage = () => {
  const { data, isLoading, isError, error, reload } = useEquipmentSheet();

  if (isError) {
    return (
      <div className={styles.page}>
        <div className={styles.stateBox}>
          <p>{error ?? 'No se pudo cargar la ficha técnica.'}</p>
          <Button text="Reintentar" type="default" onClick={reload} />
        </div>
      </div>
    );
  }

  if (!data && isLoading) {
    return (
      <div className={styles.page}>
        <LoadPanel visible shadingColor="rgba(0,0,0,0.25)" message="Cargando ficha técnica..." />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className={styles.page}>
      <LoadPanel visible={isLoading} shadingColor="rgba(0,0,0,0.15)" />
      <main className={styles.main}>
        <div className={styles.contentArea}>
          <header className={styles.pageHeader}>
            <p className={styles.pageTitle}>{data.title}</p>
            <div className={styles.badges}>
              <span className={styles.badgeStatus}>{data.statusLabel}</span>
              <span className={styles.badgeCode}>ID: {data.assetCode}</span>
            </div>
          </header>

          <MaintenanceCards sheet={data} />

          <div className={styles.contentGrid}>
            <div>
              <GeneralDataSection sheet={data} />
              <section className={`${styles.card} ${styles.photoCard}`}>
                <div className={styles.photoWrap}>
                  <img
                    className={styles.photo}
                    src={data.imageUrl}
                    alt={data.title}
                  />
                  <span className={styles.photoCaption}>{data.imageCaption}</span>
                </div>
              </section>
              <TechnicalParametersGrid rows={data.technicalParameters} />
            </div>
            <Sidebar sheet={data} />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>{data.footerText}</footer>
    </div>
  );
};
